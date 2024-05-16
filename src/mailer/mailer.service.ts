import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { SendMailDto } from './dto/send.dto';

@Injectable()
export class MailerService implements OnModuleInit {
  private logger = new Logger('MailerService');
  private transporter: Transporter;

  async onModuleInit() {
    this.transporter = createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send(dto: SendMailDto) {
    const { to, subject, html } = dto;

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    });

    this.logger.verbose(`Message sent: ${info.messageId}`);
  }
}
