// filename: src/bot/handlers.js

const {
  executeCommand,
  gitPull,
  lockComputer,
  unlockComputer
} = require('../automation');

const {
  aliases
} = require('../config/aliasCommands');
const aliasCommands = require('../config/aliasCommands');
const {
  openTerminalAndRun
} = require('../automation/shortcuts');
const automationCommands = require('../automation');
const {
  exec
} = require('child_process');

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

      const { exec } = require('child_process');
      
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

  const handleListAll = async (ctx) => {
    // Logic for handling listAll command
  };

  const handleRunAll = async (ctx) => {
    // Logic for handling runAll command
  };
  // 
  const handleGitPull = async (ctx, project) => {
    const logBuffer = await gitPull(project);
    ctx.reply(logBuffer);
  };

  bot.command('server', async (ctx) => {
    console.log("Server was sent");
    try {
      console.log("Entered /server command handler.");
      const incomingChatID = `${ctx.message.chat.id}`;

      if (!AUTHORIZED_CHAT_ID.includes(incomingChatID)) {
        console.log("Unauthorized access attempt.");
        return; // Security check
      }


      const command = ctx.message.text.split(' ')[1]; // Get the part after /server
      console.log(`Resolved command: ${command}`);

      if (command === 'listAll') {
        await handleListAll(ctx);
      } else if (command === 'runAll') {
        await handleRunAll(ctx);
      } else if (command.endsWith('pull')) {
        const project = command.slice(0, -4);
        await handleGitPull(ctx, project);
      } else {
        // Directly execute the desktop automation without aliasing
        const projectAlias = command;

        // Check if alias exists in the aliases object
        if (!aliasCommands.hasOwnProperty(command)) {
          console.log(`Alias '${command}' not found in aliasCommands.`);
          ctx.reply(`Alias '${command}' not found. Please use a valid alias.`);
          return;
        }

        ctx.reply("starting " + command); // Send a message back to Telegram
        const terminalCommand = aliasCommands[command];
        // await openTerminalAndRun(aliases[command]);
        await openTerminalAndRun(terminalCommand);
        ctx.reply(command + " was started"); // Send a message back to Telegram

      }
    } catch (error) {
      console.log("An error occurred in /server command handler:", error);
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