// src/automation/triggerService.js

const { exec } = require('child_process');

// Define command mappings directly in an object
// const commandsMap = {
//   lightsOn: 'shortcuts run "Wakeup"',
//   lightsOff: 'shortcuts run "Sleep"',
//   wakeup: 'shortcuts run "Wakeup"',
//   testShortcut: 'shortcuts run "Test1"'
// };

const commandsMap = {
  lightsOn: '/usr/bin/shortcuts run "Wakeup"',  // Replace with the actual full path
  lightsOff: '/usr/bin/shortcuts run "Sleep"',
  wakeup: '/usr/bin/shortcuts run "Wakeup"',
  testShortcut: '/usr/bin/shortcuts run "Test1"'
};


// Function to run a command based on the name
function runCommand(commandName) {
  console.log(`Attempting to run command for: ${commandName}`);

  const command = commandsMap[commandName];
  if (!command) {
    console.error(`Command "${commandName}" not found`);
    return;
  }

  console.log(`Executing command: ${command}`);
  exec(command, (error, stdout, stderr) => {
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
