import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import type { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Types } from 'mongoose';

import { PaginateArgs } from 'src/common/dto/paginate.args';
import { LevelStatusType } from 'src/common/enums/status.enum';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { deserializeScopeMask } from 'src/common/scope/scope.bitmask';
import { BaseCrudService } from 'src/common/services/base.service';
import { Notice, NoticeDocument } from 'src/notices/models/notice.schema';
import { NoticesService } from 'src/notices/notices.service';
import { Request, RequestDocument } from 'src/requests/models/request.schema';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';
import { User, UserDocument } from './models/user.schema';

@Injectable()
export class UsersService extends BaseCrudService<
  UserDocument,
  UserEntity,
  CreateUserInput,
  UpdateUserInput
> {
  constructor(
    @InjectModel(User.name) private readonly userModel: PaginateModel<UserDocument>,
    @InjectModel(Request.name) private readonly requestModel: Model<RequestDocument>,
    @InjectModel(Notice.name) private readonly noticeModel: Model<NoticeDocument>,
    private readonly noticesService: NoticesService,
    private configService: ConfigService
  ) {
    super(userModel);
  }

  private async sendNotice(doc: UserEntity, title: string, status: LevelStatusType) {
    const message = [
      doc.fullname && `Прізвище та ім'я: ${doc.fullname}`,
      doc.email && `Електронна пошта: ${doc.email}`,
      doc.phone && `Номер телефону: ${doc.phone}`
    ]
      .filter(Boolean)
      .join('\n');

    await this.noticesService.createNoticeByUserScope('user', status, title, message);
  }

  override async create(input: CreateUserInput): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(
      input.password,
      Number(this.configService.get<number>('BCRYPT_SALT'))
    );

    const result = await super.create({ ...input, password: passwordHash });

    void this.sendNotice(result, 'Створення користувача', LevelStatusType.SUCCESS);

    return result;
  }

  override async findAllPaginated(args: PaginateArgs): Promise<PaginateResult<UserEntity>> {
    return super.findAllPaginated({
      ...args,
      sort: args.sort ?? { indexip: 1 },
      filters: args.filters
    });
  }

  async findAllForNotice(scopeMaskStr: string): Promise<UserEntity[]> {
    const filterMask = deserializeScopeMask(scopeMaskStr);

    if (filterMask === 0n) return [];

    const users = await this.userModel
      .find({ status: UserStatus.ACTIVE })
      .select({ _id: 1, scope: 1 })
      .lean();

    return users.filter(u => {
      try {
        const userMask = BigInt(u.scope ?? '0');
        return (userMask & filterMask) !== 0n;
      } catch {
        return false;
      }
    }) as unknown as UserEntity[];
  }

  async updateOneById(id: string, input: UpdateUserInput): Promise<UserEntity> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор користувача');
    }

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            $set: input?.password
              ? {
                  ...input,
                  password: await bcrypt.hash(
                    input.password,
                    Number(this.configService.get<number>('BCRYPT_SALT'))
                  )
                }
              : input
          },
          { new: true }
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('Користувача не знайдено');
      }

      return updatedUser;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      if (error.code === 11000) {
        throw new BadRequestException('Користувач з такими даними вже існує');
      }
      throw new UnprocessableEntityException('Помилка при оновленні даних користувача');
    }
  }

  override async removeOneById(id: string): Promise<UserEntity> {
    const result = await super.removeOneById(id);

    await this.requestModel.deleteMany({ workerOpen: result.id });
    await this.requestModel.deleteMany({ workerClose: result.id });
    await this.noticeModel.deleteMany({ user: result.id });

    return result;
  }
}
