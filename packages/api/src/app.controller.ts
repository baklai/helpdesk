import { Controller, Get, Res } from '@nestjs/common';
import { type Response } from 'express';

@Controller()
export class AppController {
  @Get()
  redirectToApp(@Res() res: Response) {
    return res.redirect('/app');
  }
}
