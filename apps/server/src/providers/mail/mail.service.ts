import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    // Only create transporter if mail configuration is provided
    const mailHost = this.configService.get('MAIL_HOST');
    const mailUsername = this.configService.get('MAIL_USERNAME');
    const mailPassword = this.configService.get('MAIL_PASSWORD');
    
    if (mailHost && mailUsername && mailPassword) {
      this.transporter = createTransport({
        host: mailHost,
        port: this.configService.get('MAIL_PORT', 587),
        secure: false,
        auth: {
          user: mailUsername,
          pass: mailPassword,
        },
        tls: {
          rejectUnauthorized: false, // allow self-signed certs
        },
      });
    }
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      // Check if mail is configured
      if (!this.transporter) {
        console.log('Mail service not configured, skipping email send');
        return { success: false, error: 'Mail service not configured' };
      }

      const info = await this.transporter.sendMail({
        from: this.configService.get('MAIL_USERNAME'),
        to,
        subject,
        html,
      });
      return { success: true, info };
    } catch (error) {
      console.log('Failed to send email:', JSON.stringify(error, null, 2));
      return { success: false, error };
    }
  }
}
