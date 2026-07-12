import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/user.providers';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganisationService } from '../organisations/organisations.service';
import { organisationProvider } from '../organisations/organisations.provider';
import { JwtSimpleStrategy } from './jwt-simple.strategy';
import { ApiKeyStrategy } from './api-key.strategy';
import { RolesModule } from '../roles/roles.module';
import { FileStorageModule } from '../common/file-storage/file-storage.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => RolesModule),
    FileStorageModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    OrganisationService,
    ...organisationProvider,
    ...userProviders,
    LocalStrategy,
    JwtStrategy,
    JwtSimpleStrategy,
    ApiKeyStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }
