import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Check Ping')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('ping')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get the ping' })
  getData() {
    return this.appService.getPing();
  }
}
