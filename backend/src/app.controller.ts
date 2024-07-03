import { Controller, Get, Res } from '@nestjs/common';

import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('/ui')
  serveReactApp(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }

  @Get('/status')
  getHello() {
    return { status: 'OK' };
  }
}
