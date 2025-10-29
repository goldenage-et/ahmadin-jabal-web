import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthClientProvider } from '../../providers/oauth/oauth2.provider';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [ConfigService, AuthService, OAuthClientProvider],
  exports: [AuthService],
})
export class AuthModule { }
