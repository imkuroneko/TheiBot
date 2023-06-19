// Load required resources =================================================================================================
const { color } = require('console-log-colors');
const { Events } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { prefix } = require(path.resolve('./config/bot.json'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            // 🚨 Ignore bots
            if(message.author.bot) { return; }

            // 🚨 Ignore when not prefix
            if(message.content.indexOf(prefix) !== 0) { return; }

            // 🥞 Split content
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            // 🔍 Search command
            const cmd = message.client.commandsPrefix.get(command);

            if(!cmd) { return; }

            cmd.run(message.client, message, args);
        } catch(error) {
            console.error(color.red('[event:messageCreate]'), error.message);
        }
    }
}