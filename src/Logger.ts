import _ from 'lodash';
import winston from 'winston';
import Transport from 'winston-transport';
import util from 'util';

const { combine, timestamp, colorize, printf } = winston.format;

const enumerateErrorFormat = winston.format(info => {
  if (info instanceof Error) {
    const output = Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    );

    return output;
  }

  return info;
});

export function safeToString(json: any): string {
  if (isEmpty(json)) {
    return null;
  }

  try {
    return JSON.stringify(json);
  } catch (ex) {
    return util.inspect(json);
  }
}

export function isEmpty(obj: any): boolean {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function getLogger(name: string): winston.Logger {
  const isLoggerExisted = winston.loggers.has(name);
  if (!isLoggerExisted) {
    createLogger(name);
  }

  return winston.loggers.get(name);
}

function createLogger(name: string) {
  const transports: Transport[] = [];

  // Console is default logger
  const consoleTransport = _createConsoleTransport();
  transports.push(consoleTransport);
  winston.loggers.add(name, {
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      timestamp(),
      enumerateErrorFormat()
    ),
    transports,
  });
  
}

function _createConsoleTransport(): Transport {
  return new winston.transports.Console({
    format: combine(
      colorize(),
      printf(info => {
        const { timestamp, level, message, ...extra } = info;
        return `${timestamp} [${level}]: ${message}` + (isEmpty(extra) ? '' : ` | ${safeToString(extra)}`);
      })
    ),
    stderrLevels: ['error'],
  });
}


