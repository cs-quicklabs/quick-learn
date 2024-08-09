import * as nodemailer from 'nodemailer';

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
  /**
   * @param data Send Grid API Key
   * @param emai verified sender email
   */
  constructor(data: { host: string, port: number, auth: { user: string, pass: string } }, emai: string) {
    console.log(data)
    this.emailTransporter = nodemailer.createTransport({ ...data, secure: false });
    this.accountEmail = emai;
  }

  private async sendEmail(message: Message): Promise<void> {
    if (message.subject === undefined) {
      throw new Error("Subject is required");
    }

    const toAddresses = message.recipients;
    const ccAddresses = message.cc || [];
    const bccAddresses = message.bcc || [];
    const subject = message.subject;
    const body = message.body;

    const mailOptions = {
      from: this.accountEmail,
      to: toAddresses.join(', '),
      cc: ccAddresses.join(', '),
      bcc: bccAddresses.join(', '),
      subject: subject,
      html: body
    };

    try {
      const info = await this.emailTransporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async send(message: Message | Message[]): Promise<void> {
    try {
      if (Array.isArray(message)) {
        await Promise.all(message.map(msg => this.sendEmail(msg)));
      } else {
        await this.sendEmail(message);
      }
    } catch (error) {
      console.error('Failed to send email(s):', error);
      throw error;
    }
  }
}
