import { Notifer } from './Notifer';
export declare class Processor {
    private _isStarted;
    private _notifer;
    private _nextTickerTimer;
    constructor(notifer: Notifer);
    start(): void;
    onTick(): void;
    isRunning(): boolean;
    getNextTickerTimer(): number;
}
