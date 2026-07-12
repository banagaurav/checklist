import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getHealth(): { status: boolean; timestamp: string; uptime: number } {
    return {
      status: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
