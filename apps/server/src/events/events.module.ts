import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthEventListener } from './auth/auth-event.listener';
import { MailService } from '@/providers/mail/mail.service';
import { MailModule } from '@/providers/mail/mail.module';
@Module({
  imports: [EventEmitterModule.forRoot(), MailModule],
  controllers: [],
  providers: [AuthEventListener, MailService],
})
export class EventsModule { }
