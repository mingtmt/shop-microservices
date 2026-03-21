'use strict'

const winston = require('winston')
require('winston-daily-rotate-file')
const path = require('path')

const { combine, timestamp, printf, colorize, align } = winston.format

const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
)

const fileFormat = combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
)

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: fileFormat,
    transports: [
        new winston.transports.Console({
            format: consoleFormat
        }),

        // Error log to file
        new winston.transports.DailyRotateFile({
            dirname: path.join(__dirname, '../../logs'),
            filename: 'application-error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error'
        }),

        // Info, Warn, Debug log to file
        new winston.transports.DailyRotateFile({
            dirname: path.join(__dirname, '../../logs'),
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
})

module.exports = logger