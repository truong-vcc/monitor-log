"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
var Logger_1 = require("./Logger");
var logger = Logger_1.getLogger("monitor-mailer");
var Processor = (function () {
    function Processor(notifer) {
        this._isStarted = false;
        this._nextTickerTimer = 1000 * 60 * 5;
        this._notifer = notifer;
    }
    Processor.prototype.start = function () {
        if (this._isStarted) {
            logger.warn("Trying to start processor tiwce: " + this.constructor.name);
            return;
        }
        this._isStarted = true;
        logger.info("Start the first tick...");
        this.onTick();
    };
    Processor.prototype.onTick = function () {
        var _this = this;
        this._notifer
            .notify()
            .then(function () {
            setTimeout(function () {
                _this.onTick();
            }, _this.getNextTickerTimer());
        })
            .catch(function (err) {
            logger.error(_this.constructor.name + ": The worker will be restarted shortly due to error: ", err);
            _this.start();
            setTimeout(function () {
                _this.onTick();
            }, _this.getNextTickerTimer());
        });
    };
    Processor.prototype.isRunning = function () {
        return this._isStarted;
    };
    Processor.prototype.getNextTickerTimer = function () {
        return this._nextTickerTimer;
    };
    return Processor;
}());
exports.Processor = Processor;
//# sourceMappingURL=Processor.js.map