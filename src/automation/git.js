// filename: src/automation/git.js
const { keyboard, Key } = require('@nut-tree/nut-js');
const { exec } = require('child_process');
const aliases = require('../config/aliases.json');
const logger = require('../config/logger'); // Import the logger

keyboard.config.autoDelayMs = 50;

const gitPull = async (projectAlias) => {
    // In-memory log buffer
    let logBuffer = '';
    
    const directoryAlias = aliases[projectAlias];
    if (!directoryAlias) {
        logBuffer += "Project not found.";
        return logBuffer;
    }

    // Open terminal
    await keyboard.type(Key.LeftSuper, Key.Space);
    await keyboard.type("terminal");
    await keyboard.type(Key.Enter);

    logBuffer += `Opened terminal for ${projectAlias}\n`;

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use the alias to navigate to the project directory
    await keyboard.type(directoryAlias);
    await keyboard.type(Key.Enter);

    logBuffer += `Navigated to project directory using alias: ${directoryAlias}\n`;

    await new Promise(resolve => setTimeout(resolve, 500));

    return new Promise((resolve, reject) => {
        const fullPath = process.env[directoryAlias] || directoryAlias;

        exec(`cd ${fullPath} && git pull`, (err, stdout, stderr) => {
            if (err) {
                logBuffer += `Error pulling updates for ${projectAlias}: ${err.message}\n`;
                reject(logBuffer);
            } else {
                logBuffer += `Successfully pulled updates for ${projectAlias}:\n${stdout}\n`;
                resolve(logBuffer);
            }
        });
    });
};

module.exports = {
    gitPull
};
