// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { log_JoinLeft } = require(path.resolve('./config/channels.json'));
const { clientId } = require(path.resolve('./config/bot.json'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            if(member.user.id == clientId) { return; }

            const user   = member.user.tag;
            const userId = member.user.id;

            if(log_JoinLeft.length > 0) {
                const sender_log = member.guild.channels.cache.get(log_JoinLeft);
                sender_log.send({ embeds: [{
                    color: 0xe35d5d,
                    title: `👋🏻 Un usuario se acaba de ir del servidor`,
                    fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
                    footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
                }] });
            }
        } catch(error) {
            console.error('event:clientMemberRemove |', error.message);
        }
    }
};