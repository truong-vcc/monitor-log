"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileWatcher_1 = require("./src/FileWatcher");
var Mailer_1 = require("./src/Mailer");
var Processor_1 = require("./src/Processor");
function start() {
    var service = new FileWatcher_1.FileWatcher({ filePath: process.env.FILE });
    var mailer = new Mailer_1.Mailer();
    var worker = new Processor_1.Processor(mailer);
    service.attach(mailer);
    service.watchFile();
    worker.start();
}
start();
//# sourceMappingURL=index.js.map