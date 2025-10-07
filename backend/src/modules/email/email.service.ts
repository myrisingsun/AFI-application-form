import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface InvitationEmailData {
  candidateFirstName: string;
  candidateLastName: string;
  candidateEmail: string;
  invitationUrl: string;
  expiryDate: string;
  recruiterName: string;
  recruiterEmail: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'localhost',
      port: parseInt(process.env.MAIL_PORT) || 1025,
      secure: false,
      auth: process.env.MAIL_USERNAME
        ? {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          }
        : undefined,
    });
  }

  async sendInvitationEmail(data: InvitationEmailData): Promise<void> {
    try {
      const template = this.loadTemplate('invitation');
      const html = template(data);

      const mailOptions = {
        from: process.env.MAIL_FROM || 'noreply@afi-app.local',
        to: data.candidateEmail,
        subject: 'Приглашение к заполнению анкеты - AFI',
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Invitation email sent to ${data.candidateEmail}, messageId: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send invitation email to ${data.candidateEmail}`, error);
      throw error;
    }
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    // Try multiple paths to find the template
    const possiblePaths = [
      join(process.cwd(), 'src', 'templates', 'emails', `${templateName}.hbs`),
      join(process.cwd(), 'dist', 'templates', 'emails', `${templateName}.hbs`),
      join(__dirname, '..', '..', 'templates', 'emails', `${templateName}.hbs`),
    ];

    for (const templatePath of possiblePaths) {
      try {
        this.logger.debug(`Trying to load template from: ${templatePath}`);
        const templateSource = readFileSync(templatePath, 'utf-8');
        this.logger.log(`Successfully loaded email template: ${templateName} from ${templatePath}`);
        return handlebars.compile(templateSource);
      } catch (error) {
        // Continue to next path
        continue;
      }
    }

    this.logger.error(`Failed to load email template: ${templateName}. Tried paths: ${possiblePaths.join(', ')}`);
    throw new Error(`Email template not found: ${templateName}`);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection verified');
      return true;
    } catch (error) {
      this.logger.error('Email service connection failed', error);
      return false;
    }
  }
}