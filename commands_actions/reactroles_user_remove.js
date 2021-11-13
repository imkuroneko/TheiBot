const roles = require('../config/self_roles.json');
const channels = require('../config/channels.json');

const { Client, Intents } = require('discord.js');
const fg = Intents.FLAGS;
const client = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents:  [
        fg.GUILDS, fg.GUILD_INTEGRATIONS, fg.GUILD_WEBHOOKS, fg.GUILD_VOICE_STATES,
        fg.GUILD_MEMBERS, fg.GUILD_MESSAGES, fg.GUILD_MESSAGE_REACTIONS
    ]
});

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        if(reaction.message.partial) { await reaction.message.fetch(); }
        if(reaction.partial) { await reaction.fetch(); }
        if((!reaction.message.guild) || user.bot) { return; }
        if(reaction.message.channelId != channels.takeYourRole) { return; }

        // Params
        const react_id = reaction.emoji.id;
        const user_g   = reaction.message.guild.members.cache.get(user.id);

        // Search and handle
        for(var type of Object.keys(roles)) {
            for(let i = 0; i < roles[type].roles.length; i++) {
                if(react_id === roles[type].roles[i].emoji_id) {
                    await user_g.roles.remove(roles[type].roles[i].role_id).catch((e) => {});
                }
            }
        }
    }
};
