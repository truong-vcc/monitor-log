"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = exports.isEmpty = exports.safeToString = void 0;
var winston_1 = __importDefault(require("winston"));
var util_1 = __importDefault(require("util"));
var _a = winston_1.default.format, combine = _a.combine, timestamp = _a.timestamp, colorize = _a.colorize, printf = _a.printf;
var enumerateErrorFormat = winston_1.default.format(function (info) {
    if (info instanceof Error) {
        var output = Object.assign({
            message: info.message,
            stack: info.stack,
        }, info);
        return output;
    }
    return info;
});
function safeToString(json) {
    if (isEmpty(json)) {
        return null;
    }
    try {
        return JSON.stringify(json);
    }
    catch (ex) {
        return util_1.default.inspect(json);
    }
}
exports.safeToString = safeToString;
function isEmpty(obj) {
    if (obj == null)
        return true;
    if (obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;
    if (typeof obj !== 'object')
        return true;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}
exports.isEmpty = isEmpty;
function getLogger(name) {
    var isLoggerExisted = winston_1.default.loggers.has(name);
    if (!isLoggerExisted) {
        createLogger(name);
    }
    return winston_1.default.loggers.get(name);
}
exports.getLogger = getLogger;
function createLogger(name) {
    var transports = [];
    var consoleTransport = _createConsoleTransport();
    transports.push(consoleTransport);
    winston_1.default.loggers.add(name, {
        level: process.env.LOG_LEVEL || 'info',
        format: winston_1.default.format.combine(timestamp(), enumerateErrorFormat()),
        transports: transports,
    });
}
function _createConsoleTransport() {
    return new winston_1.default.transports.Console({
        format: combine(colorize(), printf(function (info) {
            var timestamp = info.timestamp, level = info.level, message = info.message, extra = __rest(info, ["timestamp", "level", "message"]);
            return timestamp + " [" + level + "]: " + message + (isEmpty(extra) ? '' : " | " + safeToString(extra));
        })),
        stderrLevels: ['error'],
    });
}
//# sourceMappingURL=Logger.js.map