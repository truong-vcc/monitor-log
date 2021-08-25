import { FileWatcher } from "./src/FileWatcher";
import { Mailer } from "./src/Mailer";
import { Processor } from "./src/Processor";
console.log(process.cwd());
require('dotenv').config({path: process.env.ENV_PATH});

function start() {
    const service = new FileWatcher({filePath: process.env.FILE});
    //default notifer is mailer with default 
    const mailer = new Mailer();
    const worker = new Processor(mailer);
    service.attach(mailer);

    service.watchFile();
    worker.start();
}

start();