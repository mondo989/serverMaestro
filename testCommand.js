const { exec } = require('child_process');

console.log("Starting AppleScript...");

const appleScript = `osascript -e 'tell application "Shortcuts" to run shortcut "Test1"'`;

exec(appleScript, (error, stdout, stderr) => {
  console.log("Running AppleScript...");
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  if (stdout) {
    console.log(`Command output: ${stdout}`);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
});

console.log("Finished command.");
