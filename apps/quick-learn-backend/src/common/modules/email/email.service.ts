import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailNotification, Message } from '@quick-learn/email';
import mjml2html from 'mjml';
import path from 'path';
import * as fs from 'fs/promises';
import * as Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';

// handlebar helper functions
Handlebars.registerHelper('currentYear', function () {
  return new Date().getFullYear();
});

@Injectable()
export class EmailService {
  private emailService: EmailNotification;
  private readonly logger = new Logger('Email Service');
  constructor(private configService: ConfigService) {
    const email = this.configService.getOrThrow('app.smtpEmail', {
      infer: true,
    });
    const options = {
      host: this.configService.getOrThrow('app.smtpHost', { infer: true }),
      port: this.configService.getOrThrow('app.smtpPort', { infer: true }),
      auth: {
        user: this.configService.getOrThrow('app.smtpUser', { infer: true }),
        pass: this.configService.getOrThrow('app.smtpPass', { infer: true }),
      },
    };
    this.emailService = new EmailNotification(options, email);
  }

  /**
   * Send email for the communication with the user
   * @param data of type Message { body: string; recipients: string[]; cc?: string[]; bcc?: string[]; subject: string; }
   * @returns true or throws error
   */
  async email(data: Message): Promise<void> {
    const emailText = data.body;
    const emailBody = await this.compileMjmlTemplate(emailText);
    try {
      await this.emailService.send({ ...data, body: emailBody });
    } catch (err) {
      this.logger.error('Something went wrong./n', JSON.stringify(err));
    }
  }

  /**
   * Generate the html for the email
   * @param body string
   * @returns html as a string for the email body
   */
  private async compileMjmlTemplate(body: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      './email-templates/notification.mjml',
    );
    const mjmlContent = await fs.readFile(templatePath, 'utf8');
    const { html } = mjml2html(mjmlContent);
    const compiledTemplate = Handlebars.compile(html);
    const mjmlCompliedContent = compiledTemplate({ body });
    return mjmlCompliedContent;
  }
}
