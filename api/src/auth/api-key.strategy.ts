import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { Role } from 'src/common/types';
import { OrganisationService } from '../organisations/organisations.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy as any,
  'api-key',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly organisationService: OrganisationService,
  ) {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      async (
        apiKey: string,
        done: (err: any, user?: any) => void,
        req: any,
      ) => {
        try {
          const orgId = req.headers['x-org-id'];
          if (!orgId) {
            return done(
              new UnauthorizedException('Missing organisation id'),
              false,
            );
          }

          const organisation = await this.organisationService.findOne(orgId);
          if (!organisation) {
            return done(
              new UnauthorizedException('Organisation not found'),
              false,
            );
          }

          const userContext = {
            apiKey,
            role: Role.CLIENT,
            orgId: organisation.id,
          };
          req.user = userContext;

          return done(null, userContext);
        } catch (err) {
          return done(err, false);
        }
      },
    );
  }

  async validate(user: any) {
    return user;
  }
}
