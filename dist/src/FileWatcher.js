"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWatcher = void 0;
var lodash_1 = __importDefault(require("lodash"));
var chokidar_1 = __importDefault(require("chokidar"));
var read_last_lines_1 = __importDefault(require("read-last-lines"));
var lru_cache_1 = __importDefault(require("lru-cache"));
var events_1 = __importDefault(require("events"));
var Logger_1 = require("./Logger");
var Utils = __importStar(require("./Utils"));
var logger = Logger_1.getLogger("monitor-geth");
var FileWatcher = (function (_super) {
    __extends(FileWatcher, _super);
    function FileWatcher(file) {
        var _this = _super.call(this) || this;
        _this._warnings = [];
        if (!Utils.fileExists(file.filePath)) {
            throw new Error("File: " + file.filePath + " is not exist");
        }
        file.fileName = file.fileName || Utils.getFileNameFromPath(file.filePath);
        _this._file = file;
        _this._cacheWarningMsg = new lru_cache_1.default({
            max: 1024,
            maxAge: 1000 * 60 * 60 * 24
        });
        if (!process.env.WARNING_MESSAGES) {
            throw new Error('WARNING_MESSAGES is required');
        }
        var warnings = process.env.WARNING_MESSAGES.split(',');
        _this._warnings = warnings.map(function (warning) { return warning.toLowerCase(); });
        return _this;
    }
    FileWatcher.prototype.attach = function (notifer) {
        this._notifer = notifer;
    };
    FileWatcher.prototype.watchFile = function () {
        var _this = this;
        logger.info("FileWatcher::watchFile Watching for file change on: " + this._file.fileName);
        var watcher = chokidar_1.default.watch(this._file.filePath, {
            persistent: true,
        });
        watcher.on('change', function (filePath) { return __awaiter(_this, void 0, void 0, function () {
            var content, tasks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, read_last_lines_1.default.read(filePath, 1)];
                    case 1:
                        content = (_a.sent()).toLowerCase();
                        logger.debug("FileWatcher::watchFile File: " + filePath + " has been updated. Content changes: " + content);
                        tasks = lodash_1.default.map(this._warnings, function (warning) { return __awaiter(_this, void 0, void 0, function () {
                            var success, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!content.includes(warning)) return [3, 4];
                                        if (!!this._cacheWarningMsg.has(warning)) return [3, 4];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        this._cacheWarningMsg.set(warning, true);
                                        return [4, this._notifer.publish({
                                                data: JSON.stringify({
                                                    file: this._file,
                                                    warning: content,
                                                }),
                                                timestamp: Utils.nowInSeconds(),
                                            })];
                                    case 2:
                                        success = _a.sent();
                                        if (!success) {
                                            logger.warn("FileWatcher::watchFile messages cannot be pushed to the queue. Maybe the queue is full, wait until the queue is empty");
                                        }
                                        return [3, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        logger.error(error_1);
                                        this._cacheWarningMsg.del(warning);
                                        return [3, 4];
                                    case 4: return [2];
                                }
                            });
                        }); });
                        Promise.all(tasks);
                        return [2];
                }
            });
        }); });
    };
    return FileWatcher;
}(events_1.default));
exports.FileWatcher = FileWatcher;
//# sourceMappingURL=FileWatcher.js.map