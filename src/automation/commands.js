// filename: src/automation/commands.js

const nut = require('@nut-tree-fork/nut-js');
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
} = require('@nut-tree-fork/nut-js');
const aliases = require('../config/aliases.json');
const logger = require('../config/logger');

const executeCommand = async (projectAlias) => {
  let logBuffer = ''; // Initialize in-memory log buffer

  const directoryAlias = aliases[projectAlias];
  if (!directoryAlias) {
    logBuffer += "Project not found.";
    return logBuffer;
  }

  let executableAlias = directoryAlias;  // Create a mutable copy to modify
  if (executableAlias.endsWith('/')) {
    // Handle directories differently, perhaps by executing a specific script or command within that directory
    // For demonstration purposes, appending 'npm start' to execute within the directory
    executableAlias += 'npm start';
  }

  // Here, assuming the executableAlias itself is the exact terminal command to start the server.
  // If this isn't the case, we need additional mappings or adjustments.
  return new Promise((resolve, reject) => {
    exec(executableAlias, (err, stdout, stderr) => {  // Note the use of executableAlias here
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


const gitPull = (projectAlias) => {
  const directoryAlias = aliases[projectAlias];
  if (!directoryAlias) {
    return Promise.reject('Project not found.');
  }

  return new Promise((resolve, reject) => {
    exec(`cd ${directoryAlias} && git pull`, (err, stdout, stderr) => {
      if (err) {
        reject(`Error pulling latest changes for ${projectAlias}: ${err.message}`);
      } else {
        resolve(`Successfully pulled latest changes for ${projectAlias}:\n${stdout}`);
      }
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
    await keyboard.type(process.env.UNLOCK_PASSWORD);
    await keyboard.pressKey(Key.Return);
    return "Computer unlocked.";
  } catch (error) {
    return `An error occurred while unlocking the computer: ${error}`;
  }
};

module.exports = {
  executeCommand,
  gitPull,
  endAll,
  lockComputer,
  unlockComputer
};
