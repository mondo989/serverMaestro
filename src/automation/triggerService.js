// src/automation/triggerService.js
const { exec } = require('child_process');

// Define command mappings directly in an object
const commandsMap = {
  allLightsOn: 'Wakeup',
  allLightsOff: 'Sleep',
  bathroomLightsOn: 'BathroomLightsOn',
  bathroomLightsOff: 'BathroomLightsOff',
  smokeyLightsOn: 'SmokeyRoomLightsOn',
  smokeyLightsOff: 'SmokeyRoomLightsOff',
  kitchenLightsOn: 'KitchenLightsOn',
  kitchenLightsOff: 'KitchenLightsOff'
};

// Function to run a command based on the name
function runCommand(commandName) {
  const shortcutName = commandsMap[commandName];
  if (!shortcutName) {
    console.error(`Command "${commandName}" not found`);
    return;
  }

  // Construct the AppleScript command
  const appleScript = `osascript -e 'tell application "Shortcuts" to run shortcut "${shortcutName}"'`;

  // Execute the AppleScript command without extra logging
  exec(appleScript, (error) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
    }
  });
}

module.exports = {
  runCommand
};
