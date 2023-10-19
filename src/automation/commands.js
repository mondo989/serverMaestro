// filename: src/automation/commands.js

const nut = require('@nut-tree/nut-js');
const {
  exec
} = require('child_process');
const {
  openTerminalAndRun
} = require('./shortcuts');
const {
  lockScreen,
  keyboard,
  Key,
  type,
  Button
} = require('@nut-tree/nut-js');
const aliases = require('../config/aliases.json');
const logger = require('../config/logger');

// Execute command based on received alias

const executeCommand = async (projectAlias) => {
  let logBuffer = ''; // Initialize in-memory log buffer

  const directoryAlias = aliases[projectAlias];
  if (!directoryAlias) {
    logBuffer += "Project not found.";
    return logBuffer;
  }

  // Here, assuming the directoryAlias itself is the exact terminal command to start the server.
  // If this isn't the case, we need additional mappings or adjustments.
  return new Promise((resolve, reject) => {
    exec(directoryAlias, (err, stdout, stderr) => {
      if (err) {
        logBuffer += `Error starting server for ${projectAlias}: ${err.message}\n`;
        reject(logBuffer);
      } else {
        logBuffer += `Server for ${projectAlias} started with message:\n${stdout}\n`;
        resolve(logBuffer);
      }
    });
  });
};

const gitPull = (projectPath) => {
  return new Promise((resolve, reject) => {
    exec(`cd ${projectPath} && git pull`, (err, stdout, stderr) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(stdout);
    });
  });
};

// Placeholder function for ending all servers
const endAll = () => {
  openTerminalAndRun('some-alias-to-end-all-servers');
};

const lockComputer = async () => {
  try {
    await keyboard.pressKey(nut.Key.LeftSuper, nut.Key.LeftControl, nut.Key.Q);
    await keyboard.releaseKey(nut.Key.LeftSuper, nut.Key.LeftControl, nut.Key.Q);

    return "Computer locked.";
  } catch (error) {
    return `An error occurred while locking the computer: ${error}`;
  }
};

const unlockComputer = async () => {
  try {
    // await type(process.env.UNLOCK_PASSWORD);
    await keyboard.type(process.env.UNLOCK_PASSWORD);
    await keyboard.pressKey(Key.Return);
    return "Computer unlocked.";
  } catch (error) {
    return `An error occurred while unlocking the computer: ${error}`;
  }
};


console.log("Inside commands.js. lockComputer:", lockComputer);

module.exports = {
  executeCommand,
  gitPull,
  endAll,
  lockComputer,
  unlockComputer
};
