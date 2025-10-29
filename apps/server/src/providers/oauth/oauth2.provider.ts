import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthProvider, TGoogleUser, ZGoogleUser } from '@repo/common';
import { OAuthClient } from './oauth2.client';

@Injectable()
export class OAuthClientProvider {
  constructor(private readonly configService: ConfigService) { }

  getClient(provider: OAuthProvider) {
    switch (provider) {
      case OAuthProvider.google:
        return this.createGoogleOAuthClient();
      default:
        throw new Error(`Invalid provider: ${provider}`);
    }
  }

  private createGoogleOAuthClient(): OAuthClient<TGoogleUser> {
    return new OAuthClient(this.configService, {
      provider: OAuthProvider.google,
      clientId: this.configService.get<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      urls: {
        auth: 'https://accounts.google.com/o/oauth2/v2/auth',
        token: 'https://oauth2.googleapis.com/token',
        user: 'https://www.googleapis.com/oauth2/v1/userinfo',
      },
      userInfo: {
        schema: ZGoogleUser as any,
        parser: (user) => ({
          id: user.id,
          firstName: user.given_name || user.name || '',
          middleName: user.family_name || '',
          email: user.email,
        }),
      },
    });
  }
}
