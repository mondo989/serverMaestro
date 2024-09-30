const { exec } = require('child_process');

const shortcutsPath = '/usr/bin/shortcuts';  // Replace with actual output from `which shortcuts`

exec(`${shortcutsPath} run "Test1"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  console.log(`Command output: ${stdout}`);
});
