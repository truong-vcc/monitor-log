import * as mailer from "nodemailer";
import { Notifer } from "./Notifer";
import { getLogger } from "./Logger";
import { Message } from "./Message";

const logger = getLogger("monitor-mailer");

export interface IMailerOptions {
  from?: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  content: string;
  returnPath?: string;
}

export class Mailer extends Notifer {
  private _msg: Message = null;
  private _options: any;
  private _transporter: mailer.Transporter;

  constructor() {
    super({});
    this.config();
  }

  private config() {
    const host = process.env.MAIL_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.MAIL_PORT, 10) || 465;
    const user = process.env.MAIL_USERNAME;
    const password = process.env.MAIL_PASSWORD;

    if (!user || !password) {
      throw new Error(
        `Mailer could not setup with credentials: user=${user}, password=${password}`
      );
    }

    this._options = {
      host,
      port,
      secure: port === 465 ? true : false,
      auth: {
        type: 'login',
        user,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: false,
    };

    this._transporter = mailer.createTransport(this._options);
  }

  /**
   * @override
   */
  public async notify(): Promise<void> {
    if (!this._msg) {
      this._msg = this._messagges.shift();
    }
    if (!this._msg) {
      logger.info("Message queue is empty. Wait for the next tick...");
      return;
    }
    const msgStr = JSON.stringify(this._msg)
    await this.sendEmail({
        to: process.env.MAIL_RECIPIENT,
        subject: '',
        content: msgStr,    
    })
    logger.info(`Notice has been sent: ${msgStr}`);
    this._msg = null;
  }

  /**
   * sendEmail
   */
  public async sendEmail(opts: IMailerOptions): Promise<any> {
    const mailOptions: mailer.SendMailOptions = {
      from: this._options.from || this._options.auth.user,
      to: opts.to,
      cc: opts.cc,
      bcc: opts.bcc,
      envelope: {
        from: this._options.from || this._options.auth.user,
        to: opts.to,
      },
      subject: opts.subject,
      text: opts.content,
    };
    if (!this._transporter) {
      throw new Error(
        `Mailer transpoter was not set, transporter=${this._transporter}. Please check your configure.`
      );
    }
    const info = await this._transporter.sendMail(mailOptions);
    logger.info(`Message sent: ${info.messageId}`);
    logger.info(`Preview URL: ${mailer.getTestMessageUrl(info)}`);
    return info;
  }
}

