import * as nodemailer from 'nodemailer';
import { BrowserUtils } from './browserUtils';
import { generatePreviewHTML } from './emailTemplate';

export type Message = {
  body: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
};

export class EmailNotification {
  private accountEmail: string;
  private emailTransporter: nodemailer.Transporter;
  private isDevelopment: boolean;

  /**
   * @param data Send Grid API Key
   * @param emai verified sender email
   */

  constructor(
    data: { host: string; port: number; auth: { user: string; pass: string } },
    email: string,
    isDevelopment: boolean,
  ) {
    this.emailTransporter = nodemailer.createTransport({
      ...data,
      secure: false,
    });
    this.accountEmail = email;
    this.isDevelopment = isDevelopment;
  }

  private async sendEmail(message: Message) {
    if (!message.subject) {
      throw new Error('Subject is required');
    }

    const mailOptions = {
      from: this.accountEmail,
      to: message.recipients.join(', '),
      cc: message.cc?.join(', ') || '',
      bcc: message.bcc?.join(', ') || '',
      subject: 'Quick Learn: ' + message.subject,
      html: message.body,
    };

    if (!this.isDevelopment) {
      try {
        const info = await this.emailTransporter.sendMail(mailOptions);
        console.log('Email sent successfully to', info.accepted.join(', '));
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
    } else {
      // to view in local
      const previewHTML = generatePreviewHTML({
        subject: mailOptions.subject,
        to: mailOptions.to,
        cc: mailOptions.cc,
        bcc: mailOptions.bcc,
        html: mailOptions.html,
      });

      await BrowserUtils.previewHTML(previewHTML);
    }
  }

  async send(message: Message | Message[]): Promise<void> {
    try {
      if (Array.isArray(message)) {
        await Promise.all(message.map((msg) => this.sendEmail(msg)));
      } else {
        await this.sendEmail(message);
      }
    } catch (error) {
      console.error('Failed to send email(s):', error);
      throw error;
    }
  }
}
