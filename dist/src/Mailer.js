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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
var mailer = __importStar(require("nodemailer"));
var Notifer_1 = require("./Notifer");
var Logger_1 = require("./Logger");
var logger = Logger_1.getLogger("monitor-mailer");
var Mailer = (function (_super) {
    __extends(Mailer, _super);
    function Mailer() {
        var _this = _super.call(this, {}) || this;
        _this._msg = null;
        _this.config();
        return _this;
    }
    Mailer.prototype.config = function () {
        var host = process.env.MAIL_HOST || "smtp.gmail.com";
        var port = parseInt(process.env.MAIL_PORT, 10) || 465;
        var user = process.env.MAIL_USERNAME;
        var password = process.env.MAIL_PASSWORD;
        if (!user || !password) {
            throw new Error("Mailer could not setup with credentials: user=" + user + ", password=" + password);
        }
        this._options = {
            host: host,
            port: port,
            secure: port === 465 ? true : false,
            auth: {
                type: 'login',
                user: user,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
            logger: false,
        };
        this._transporter = mailer.createTransport(this._options);
    };
    Mailer.prototype.notify = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msgStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._msg) {
                            this._msg = this._messagges.shift();
                        }
                        if (!this._msg) {
                            logger.info("Message queue is empty. Wait for the next tick...");
                            return [2];
                        }
                        msgStr = JSON.stringify(this._msg);
                        return [4, this.sendEmail({
                                to: process.env.MAIL_RECIPIENT,
                                subject: '',
                                content: msgStr,
                            })];
                    case 1:
                        _a.sent();
                        logger.info("Notice has been sent: " + msgStr);
                        this._msg = null;
                        return [2];
                }
            });
        });
    };
    Mailer.prototype.sendEmail = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var mailOptions, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mailOptions = {
                            from: this._options.from || this._options.auth.user,
                            to: opts.to,
                            cc: opts.cc,
                            bcc: opts.bcc,
                            envelope: {
                                from: this._options.from || this._options.auth.user,
                                to: opts.to,
                            },
                            subject: opts.subject,
                            text: opts.content,
                        };
                        if (!this._transporter) {
                            throw new Error("Mailer transpoter was not set, transporter=" + this._transporter + ". Please check your configure.");
                        }
                        return [4, this._transporter.sendMail(mailOptions)];
                    case 1:
                        info = _a.sent();
                        logger.info("Message sent: " + info.messageId);
                        logger.info("Preview URL: " + mailer.getTestMessageUrl(info));
                        return [2, info];
                }
            });
        });
    };
    return Mailer;
}(Notifer_1.Notifer));
exports.Mailer = Mailer;
//# sourceMappingURL=Mailer.js.map