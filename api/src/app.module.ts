import { Logger, LoggerModule } from 'nestjs-pino';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { pinoLokiOptions } from './utils/logger';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileStorageModule } from './common/file-storage/file-storage.module';

const config = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FileStorageModule,
    AuthModule,
    LoggerModule.forRoot(pinoLokiOptions(config)),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
  ],
})
export class AppModule { }
