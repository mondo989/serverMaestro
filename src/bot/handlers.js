// filename: src/bot/handlers.js

const {
  executeCommand,
  gitPull,
  lockComputer,
  unlockComputer
} = require('../automation');

const aliases = require('../config/aliases.json');
const { openTerminalAndRun } = require('../automation/shortcuts');
const automationCommands = require('../automation');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const AUTHORIZED_CHAT_ID = process.env.CHAT_ID;

const register = (bot) => {

  bot.command('start', (ctx) => {
    ctx.reply('We are ready to roll!');
    console.log("start was recieved")
  });

  bot.command('test', async (ctx) => {

    const incomingChatID = `${ctx.message.chat.id}`;
    if (!AUTHORIZED_CHAT_ID.includes(incomingChatID)) {
      console.log("Unauthorized access attempt.");
      return; // Security check
    }

    try {
      console.log("Entered /test command handler."); // Log in the console
      ctx.reply("Taking screenshot."); // Send a message back to Telegram

      // Capture the screenshot using macOS's built-in 'screencapture' command
      const {
        exec
      } = require('child_process');
      const screenshotPath = path.join(os.homedir(), 'Desktop', 'sMScreenshots', 'screenshot.png');
      exec(`screencapture -x ${screenshotPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Screenshot capture failed: ${error}`);
          return;
        }
        console.log(`Screenshot captured: ${stdout}`);

        // Send the screenshot via Telegraf's built-in method
        const fs = require('fs');
        ctx.replyWithPhoto({
          source: fs.createReadStream(screenshotPath)
        });
      });
    } catch (error) {
      console.log("An error occurred in /test command handler:", error);
    }
  });

  bot.command('lock', async (ctx) => {
    const incomingChatID = `${ctx.message.chat.id}`;
    if (!AUTHORIZED_CHAT_ID.includes(incomingChatID)) {
      console.log("Unauthorized access attempt.");
      return; // Security check
    }

    try {
      const message = await lockComputer();
      ctx.reply(message);

      const {
        exec
      } = require('child_process');

      ctx.reply("Please wait, taking screenshot.");
      const screenshotPath = path.join(os.homedir(), 'Desktop', 'sMScreenshots', 'screenshot.png');
      exec(`screencapture -x ${screenshotPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Screenshot capture failed: ${error}`);
          return;
        }
        console.log(`Screenshot captured: ${stdout}`);

        // Send the screenshot via Telegraf's built-in method
        const fs = require('fs');
        ctx.replyWithPhoto({
          source: fs.createReadStream(screenshotPath)
        });
      });
    } catch (error) {
      console.log("An error occurred in /lock command handler:", error);
    }
  });

  bot.command('unlock', async (ctx) => {
    const incomingChatID = `${ctx.message.chat.id}`;
    if (!AUTHORIZED_CHAT_ID.includes(incomingChatID)) {
      console.log("Unauthorized access attempt.");
      return; // Security check
    }

    try {
      const message = await unlockComputer();
      ctx.reply(message);

      const {
        exec
      } = require('child_process');

      ctx.reply("Please wait, taking screenshot.");
      const screenshotPath = path.join(os.homedir(), 'Desktop', 'sMScreenshots', 'screenshot.png');
      exec(`screencapture -x ${screenshotPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Screenshot capture failed: ${error}`);
          return;
        }
        console.log(`Screenshot captured: ${stdout}`);

        // Send the screenshot via Telegraf's built-in method
        const fs = require('fs');
        ctx.replyWithPhoto({
          source: fs.createReadStream(screenshotPath)
        });
      });
    } catch (error) {
      console.log("An error occurred in /unlock command handler:", error);
    }
  });

  bot.command('server', async (ctx) => {
    try {
      console.log("Entered /server command handler.");
      const incomingChatID = `${ctx.message.chat.id}`;
      if (AUTHORIZED_CHAT_ID !== incomingChatID) {
        console.log("Unauthorized access attempt.");
        return; // Security check
      }
      const command = ctx.message.text.split(' ')[1]; // Get the part after /server
  
      // Resolve the command to its corresponding alias from aliases.json
      const resolvedAlias = aliases[command] || command;
  
      // Logic to decide whether to run npm start (this could be based on a flag, or some other condition)
      const shouldRunNpmStart = true; // For demonstration, set to true
  
      // Form the terminal command
      let terminalCommand = `cd ${resolvedAlias}`;
      if (shouldRunNpmStart) {
        terminalCommand += ' && npm start';
      }
  
      console.log(`Resolved command: ${command}`);
      ctx.reply("Starting " + command); // Send a message back to Telegram
  
      // Invoke nut.js to open terminal and run the command
      await openTerminalAndRun(terminalCommand);
  
      const logBuffer = "Command executed via nut.js";
      ctx.reply(logBuffer); // Send the log buffer back to Telegram
    } catch (error) {
      console.log("An error occurred in /server command handler:", error);
    }
  });
  
  bot.command('pull', async (ctx) => {
    try {
      console.log("Entered /pull command handler.");
      const incomingChatID = `${ctx.message.chat.id}`;
      if (incomingChatID !== AUTHORIZED_CHAT_ID) {
        console.log("Unauthorized access attempt.");
        return; // Security check
      }
      const repoName = ctx.message.text.split(' ')[1]; // Get the part after /pull
  
      // Resolve the repoName to its corresponding alias from aliases.json
      const resolvedAlias = aliases[repoName] || repoName;
  
      // Logic to decide whether to run git pull (this could be based on a flag, or some other condition)
      const shouldRunGitPull = true; // For demonstration, set to true
  
      // Form the terminal command
      let terminalCommand = `cd ${resolvedAlias}`;
      if (shouldRunGitPull) {
        terminalCommand += ' && git pull';
      }
  
      console.log(`Pulling latest changes for repository: ${repoName}`);
      ctx.reply("Starting git pull for " + repoName); // Send a message back to Telegram
  
      // Invoke nut.js to open terminal and run the command
      await openTerminalAndRun(terminalCommand);
  
      const logBuffer = "Git pull executed via nut.js";
      ctx.reply(logBuffer); // Send the log buffer back to Telegram
    } catch (error) {
      console.log("An error occurred in /pull command handler:", error);
      ctx.reply(`An error occurred: ${error.message}`);
    }
  });

  bot.on('text', (ctx) => {
    console.log(`Received text: ${ctx.message.text}`);
  });

  bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  });
};

module.exports = {
  register
};