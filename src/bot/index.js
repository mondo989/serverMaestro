// filename: src/bot/index.js

require('dotenv').config();

const {
  Telegraf
} = require('telegraf');
const handlers = require('./handlers');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(TOKEN);

console.log("Invoking register function to set up bot handlers.");
handlers.register(bot);

bot.launch(); // This starts the bot

module.exports = bot;