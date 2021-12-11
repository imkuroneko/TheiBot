const config = require('../config/bot.json');
const { Client, Intents } = require('discord.js');
const client = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents:  [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING
    ]
});

module.exports = {
    name: 'messageCreate',
    async execute(msg) {

        // Evitar bots
        if(msg.author.bot) { return; } 

        // Contenido del mensaje [inicial]
        msg_guild   = msg.guild;
        msg_content = msg.content.toLocaleLowerCase().trim();

        // Evitar que el bot no actue en otro discord
        if(msg_guild != config.guildId) { return; }

        // Thei loves nuggots 🍗
        nuggots_ = ['nugget', 'nuggot', 'nyuggot', 'nuggat'];
        for(let index = 0; index < nuggots_.length; index++) {
            if(msg_content.includes(nuggots_[index])) {
                msg.react('864676232737718292');
                msg.reply("Gimme nuggots! <:nuggots:864676232737718292>");
            }
        }

        // Thei is watching you 👀
        if(msg_content.includes('thei')) {
            msg.react('👀');
            msg.react('🦄');
            msg.react('🔪');
            msg.reply("How dare you hooman! ");
        }
    }
};