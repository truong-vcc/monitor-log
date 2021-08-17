import { Notifer } from "./Notifer";
export interface IMailerOptions {
    from?: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    content: string;
    returnPath?: string;
}
export declare class Mailer extends Notifer {
    private _msg;
    private _options;
    private _transporter;
    constructor();
    private config;
    notify(): Promise<void>;
    sendEmail(opts: IMailerOptions): Promise<any>;
}
