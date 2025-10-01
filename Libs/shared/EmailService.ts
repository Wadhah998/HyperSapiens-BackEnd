// libs/shared/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private fromAddress: string;

  constructor(private readonly config: ConfigService) {
    // Construire le transporteur SMTP depuis les vars d'env
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: Number(this.config.get<number>('SMTP_PORT')),
      secure: this.config.get<string>('SMTP_SECURE') === 'true', // true si port 465
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });

    this.fromAddress = this.config.get<string>('EMAIL_FROM') as string;
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.fromAddress,
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}: messageId=${info.messageId}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}
