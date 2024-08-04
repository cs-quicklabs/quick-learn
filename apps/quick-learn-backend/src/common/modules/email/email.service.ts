import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailNotification, Message } from '@quick-learn/sendgrid';
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
  private sendGrid: EmailNotification;
  private readonly logger = new Logger('Email Service');
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('app.sendGridAPIKey', {
      infer: true,
    });
    const email = this.configService.get('app.sendGridEmail', { infer: true });
    this.sendGrid = new EmailNotification(apiKey, email);
  }

  /**
   * Send email for the communication with the user
   * @param data of type Message { body: string; recipients: string[]; cc?: string[]; bcc?: string[]; subject: string; }
   * @returns true or throws error
   */
  async email(data: Message): Promise<boolean | string> {
    const emailText = data.body;
    const emailBody = await this.compileMjmlTemplate(emailText);
    try {
      await this.sendGrid.send({ ...data, body: emailBody });
      return true;
    } catch (err) {
      this.logger.error('Something went wrong./n', JSON.stringify(err));
      throw new InternalServerErrorException('Something went wrong.');
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
