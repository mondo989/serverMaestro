// filename: src/config/logger.js

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    level: 'info',  // Log level (can be adjusted to 'debug', 'warn', 'error', etc.)
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        // Log to the console
        new transports.Console(),
        
        // And log to a file
        new transports.File({ filename: './logs/serverMaestro.log' })
    ]
});

module.exports = logger;
