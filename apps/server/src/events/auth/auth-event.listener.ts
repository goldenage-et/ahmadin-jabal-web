import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailVerificationEvent } from './auth-event.interface';
import verificationOtpHtml from '@/templates/verification-otp.template';
import { MailService } from '@/providers/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthEventListener {
  private readonly logger = new Logger(AuthEventListener.name);
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) { }

  @OnEvent('user.registration', { async: true })
  async handleUserRegistrationEvent({ payload }: EmailVerificationEvent) {
    this.logger.log('user.registration');
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log('user.registration', payload);
      return;
    }
    const result = await this.mailService.sendMail({
      to: payload.email,
      subject: 'Welcome to Our Platform',
      html: verificationOtpHtml({
        otp: payload.otp,
        title: 'Welcome to Our Platform',
        subtitle: `Dear ${payload.firstName} ${payload.middleName}`,
        description:
          'Thank you for registering. Please verify your email to activate your account.',
      }),
    });
  }

  @OnEvent('email.verification', { async: true })
  async handleEmailVerificationEvent({ payload }: EmailVerificationEvent) {
    this.logger.log('email.verification');
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log('email.verification', payload);
      return;
    }
    const result = await this.mailService.sendMail({
      to: payload.email,
      subject: 'Verify Your Email Address',
      html: verificationOtpHtml({
        otp: payload.otp,
        title: 'Verify Your Email Address',
        subtitle: `Dear ${payload.firstName} ${payload.middleName}`,
        description:
          'Please use the OTP provided to verify your email address and complete the process.',
      }),
    });
  }

  @OnEvent('forget.password', { async: true })
  async handleForgetPasswordEvent({ payload }: EmailVerificationEvent) {
    this.logger.log('forget.password');
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log('forget.password', payload);
      return;
    }
    const result = await this.mailService.sendMail({
      to: payload.email,
      subject: 'Reset Your Password',
      html: verificationOtpHtml({
        otp: payload.otp,
        title: 'Reset Your Password',
        subtitle: `Dear ${payload.firstName} ${payload.middleName}`,
        description:
          'We received a request to reset your password. Please use the OTP provided to proceed.',
      }),
    });
  }
}
