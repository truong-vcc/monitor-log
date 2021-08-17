import { getLogger } from "./Logger";
import {Notifer} from './Notifer';
const logger = getLogger("monitor-mailer");

export class Processor {
    private _isStarted: boolean = false;
    private _notifer: Notifer;
    private _nextTickerTimer: number = 1000 * 60 * 5; // 5 minutes
  
    constructor(notifer: Notifer) {
      this._notifer = notifer;
    }
  
    public start(): void {
      if (this._isStarted) {
        logger.warn(`Trying to start processor tiwce: ${this.constructor.name}`);
        return;
      }
  
      this._isStarted = true;
      logger.info("Start the first tick...");
      this.onTick();
    }
  
    public onTick(): void {
      this._notifer
        .notify()
        .then(() => {
          setTimeout(() => {
            this.onTick();
          }, this.getNextTickerTimer());
        })
        .catch((err) => {
          logger.error(
            `${this.constructor.name}: The worker will be restarted shortly due to error: `,
            err
          );
          this.start();
          setTimeout(() => {
            this.onTick();
          }, this.getNextTickerTimer());
        });
    }
  
    public isRunning() {
      return this._isStarted;
    }
  
    public getNextTickerTimer() {
      return this._nextTickerTimer;
    }
  }
  