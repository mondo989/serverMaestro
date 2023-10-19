// filename: src/automation/index.js

const { 
    executeCommand, 
    gitPull, 
    endAll, 
    lockComputer, 
    unlockComputer 
  } = require('./commands');
  
  const { openTerminalAndRun } = require('./shortcuts');
  
  module.exports = {
    executeCommand,
    gitPull,
    endAll,
    lockComputer,
    unlockComputer,
    openTerminalAndRun
  };
  