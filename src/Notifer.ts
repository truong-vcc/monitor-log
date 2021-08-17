import {Message} from './Message';
import * as Utils from './Utils';

const DEFAULT_SIZE_OF_MESSAGE_QUEUE = 100;
const DEFAULT_RETRY_COUNT = 5;

export abstract class Notifer{
    protected _messagges: Message[];
    protected _size: number;
    protected _retryCount: number;

    constructor(opts: {size?: number, retryCount?: number}){
        this._messagges = [];
        const options = opts || {};
        this._size = options.size || DEFAULT_SIZE_OF_MESSAGE_QUEUE;
        this._retryCount = options.retryCount || DEFAULT_RETRY_COUNT;
    }

    /**
     * publish - push messages to queue
     * @param {Message} msg
     * @param {number - optional}
     */
    public async publish(msg: Message, retry?: number): Promise<boolean>{
        if (isNaN(retry)) {
            retry = 1;
        }
            
        if (this._messagges.length === this._size) {
            if (retry < this._retryCount) {
                await Utils.timeout(500);
                return this.publish(msg, retry++);
            }
            return false;
        }
        this._messagges.push(msg);
        return true;
    }

    public abstract notify();
}  