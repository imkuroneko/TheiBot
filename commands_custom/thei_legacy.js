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

        // Helper para envío de mensaje
        const sender = client.channels.cache.find(channel => channel.id == msg.channel.id);

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
            // sender.send({ stickers: ['860998687735021598'] });
            msg.react('👀');
            msg.react('🦄');
            msg.react('🔪');
            msg.reply("How dare you hooman! ");
        }
        
        // Verificación de contenido y prefix de comando
        if(msg_content.replace(config.prefix, '').trim().length == 0) { return; }


        // Contenido separado para mejor uso
        const command = msg_content.split(' ')[0].substring(1).toLowerCase();
        const param   = msg_content.replace(config.prefix, '').replace(command+' ', '');

        // Get Tagged User
        mentioned = msg.mentions.users.first();
        if(mentioned !== undefined) {
            param = msg.mentions.users.first().id;
        }

        switch(command) {
            case 'serverinfo':
                let level         = msg_guild.premiumTier === 0 ? msg_guild.premiumTier : msg_guild.premiumTier.replace('TIER_', '');
                let boost         = msg_guild.premiumSubscriptionCount;
                let owner         = msg_guild.ownerId;
                let guild         = msg_guild.name;
                let channel_count = msg_guild.channels.cache.size;
                let roles_count   = msg_guild.roles.cache.size;
                let members_count = msg_guild.memberCount;

                sender.send({ embeds: [{
                    color: 0xcc3366,
                    fields: [
                        { name: '📦⠀Nombre del Servidor', value: `⠀\`${guild}\`` },
                        { name: '💎⠀Mejoras del Servidor', value: `⠀**Boosts:** \`${boost}\`\n⠀**Nivel:** \`${level}\`` },
                        { name: '👰🏻⠀Owner', value: "⠀<@"+owner+">" },
                        { name: '🔢⠀Detalles', value: `⠀**Canales:** \`${channel_count}\`\n⠀**Roles:** \`${roles_count}\`\n⠀**Usuarios:** \`${members_count}\`` }
                    ]
                }] });
                break;
            // ================================================================================================================================
            case 'botinfo':
                sender.send({ embeds: [{
                    color: 0x9c5bde,
                    fields: [
                        { name: "🏷⠀Versión", value: "```<:tag:818254431308349461> 1.0.2 · 2021-09-24 ```" },
                        { name: "💻⠀Recuros", value: "<:nodejs:818254431844827158> `node.js v16.6.2`; `pm2 v5.1.0`; `discord.js v13`; `@discordjs/voice v0.5.5`" },
                        { name: "👰🏻⠀Developer", value: "`[@imkuroneko](https://github.com/imkuroneko)`" },
                        { name: "⛓⠀Repositorio", value: "<:github:818254431363530753> https://github.com/imkuroneko/TheiBot" },
                    ]
                }] });
                break;
            // ================================================================================================================================
            case 'acercade':
                sender.send({ embeds: [{
                    color: 0xeb5b8b,
                    fields: [
                        { name: "👰🏻⠀Sobre Mí", value: "```25 años; De alguna parte de LATAM```" },
                        { name: "🌸⠀Hobbies", value: "```👰🏻 Cosplayer; 🎥 Streamer; 💻 Web Developer & DBA; 🔐 SysOp Jr; 🤖 Discord Bot Developer```" },
                        { name: "⛓⠀Repositorio", value: "https://github.com/imkuroneko" },
                    ]
                }] });
                break;
            // ================================================================================================================================
            case 'sendmsg':
                msg.delete();
                if(msg.author.id != config.ownerId) { return }
                sender.send({ embeds: [{ color: 0xeb5b8b, description: param }] });
                break;
            // ================================================================================================================================
            case 'sendjson':
                msg.delete();
                if(msg.author.id != config.ownerId) { return }
                sender.send({ embeds: [ JSON.parse(param) ] });
                break;
        }
    }
};