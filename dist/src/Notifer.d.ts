import { Message } from './Message';
export declare abstract class Notifer {
    protected _messagges: Message[];
    protected _size: number;
    protected _retryCount: number;
    constructor(opts: {
        size?: number;
        retryCount?: number;
    });
    publish(msg: Message, retry?: number): Promise<boolean>;
    abstract notify(): any;
}
