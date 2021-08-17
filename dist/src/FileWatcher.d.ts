/// <reference types="node" />
import { Notifer } from "./Notifer";
import EventEmitter from "events";
export interface IFile {
    filePath: string;
    fileName?: string;
    description?: string;
}
export declare class FileWatcher extends EventEmitter {
    private _file;
    private _notifer;
    private _cacheWarningMsg;
    private _warnings;
    constructor(file: IFile);
    attach(notifer: Notifer): void;
    watchFile(): void;
}
