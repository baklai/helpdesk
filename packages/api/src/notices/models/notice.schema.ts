import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { LevelStatusType } from 'src/common/enums/status.enum';

@Schema()
export class Notice {
  @Prop({ type: String, required: true, trim: true })
  readonly title: string;

  @Prop({ type: String, required: true, trim: true })
  readonly message: string;

  @Prop({
    type: String,
    enum: LevelStatusType,
    default: LevelStatusType.SECONDARY,
    required: true
  })
  readonly status: LevelStatusType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    autopopulate: false
  })
  readonly user: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: Date.now, expires: '90d' })
  readonly expiresAt?: Date;
}

export type NoticeDocument = HydratedDocument<Notice>;

export const NoticeSchema = SchemaFactory.createForClass(Notice);
