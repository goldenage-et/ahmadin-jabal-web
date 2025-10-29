import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Global()
@Module({
  providers: [MailService, ConfigService],
  exports: [MailService],
})
export class MailModule {}
