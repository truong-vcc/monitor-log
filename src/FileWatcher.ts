import _ from "lodash";
import chokidar from 'chokidar';
import readLastLines from 'read-last-lines';
import LRU from 'lru-cache';
import { Notifer } from "./Notifer";
import EventEmitter from "events";
import {getLogger} from "./Logger";
import * as Utils from './Utils';

const logger = getLogger("monitor-geth");

export interface IFile {
    filePath: string;
    fileName?: string;
    description?: string;
}

export class FileWatcher extends EventEmitter {
    private _file: IFile;
    private _notifer: Notifer;
    private _cacheWarningMsg: LRU<string, boolean>;
    private _warnings: string[] = [];

    constructor(file: IFile) {
        super();
        if (!Utils.fileExists(file.filePath)) {
            throw new Error(`File: ${file.filePath} is not exist`);
        }
        file.fileName = file.fileName || Utils.getFileNameFromPath(file.filePath);
        this._file = file;
        this._cacheWarningMsg = new LRU({
            max: 1024,
            maxAge: 1000 * 60 * 60 * 24  // 1 day
        });
        
        if (!process.env.WARNING_MESSAGES) {
            throw new Error('WARNING_MESSAGES is required');
        }
        //data cleaning
        const warnings = (process.env.WARNING_MESSAGES as string).split(',');
        this._warnings = warnings.map(warning => warning.toLowerCase());
    }

    /**
     * attach
     * register notifer
     */
    public attach(notifer: Notifer) {
        this._notifer = notifer;
    }

    /**
     * watchFile
     * check file changes then push to notifer's message queue
     */
    public watchFile() {
        logger.info(`FileWatcher::watchFile Watching for file change on: ${this._file.fileName}`);
            
        const watcher = chokidar.watch(this._file.filePath, {
            persistent: true,
        });

        //listen when file has been added
        watcher.on('change', async (filePath) => {
            const content = (await readLastLines.read(filePath, 1)).toLowerCase();
            logger.debug(`FileWatcher::watchFile File: ${filePath} has been updated. Content changes: ${content}`);

            const tasks = _.map(this._warnings, async (warning) => {
                if (content.includes(warning)) {    
                    //Warnings of the same type need to be notified only once a day
                    if (!this._cacheWarningMsg.has(warning)) {
                        try {
                            this._cacheWarningMsg.set(warning, true);
                            const success = await this._notifer.publish({
                                data: JSON.stringify({
                                    file: this._file,
                                    warning: content,
                                }),
                                timestamp: Utils.nowInSeconds(),
                            });

                            if (!success) {
                                logger.warn(`FileWatcher::watchFile messages cannot be pushed to the queue. Maybe the queue is full, wait until the queue is empty`)
                            }
                        } catch (error) {
                            logger.error(error);
                            //If notification activation fails, clear the warning from the cache so it can be sent again
                            this._cacheWarningMsg.del(warning);
                        }
                    } else {
                        logger.info(`FileWatcher::watchFile ${warning} - This warning has been sent, please wait until it is handled.`)
                    }
                }
            })
            Promise.all(tasks);
        })
    }
}

