// src/automation/triggerService.js
const { exec } = require('child_process');

// Define command mappings directly in an object
const commandsMap = {
  lightsOn: 'Wakeup',  // Name of the Shortcuts to run
  lightsOff: 'Sleep',
  wakeup: 'Wakeup',
  testShortcut: 'Test1'
};

// Function to run a command based on the name
function runCommand(commandName) {
  console.log(`Attempting to run command for: ${commandName}`);

  const shortcutName = commandsMap[commandName];
  if (!shortcutName) {
    console.error(`Command "${commandName}" not found`);
    return;
  }

  // Construct the AppleScript command
  const appleScript = `osascript -e 'tell application "Shortcuts" to run shortcut "${shortcutName}"'`;

  console.log(`Executing command via AppleScript: ${appleScript}`);
  exec(appleScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      console.error(`Error code: ${error.code}`);
      console.error(`Signal received: ${error.signal}`);
      return;
    }
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
    }
    console.log(`Command output: ${stdout}`);
  });
}

module.exports = {
  runCommand
};
