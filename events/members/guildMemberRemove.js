// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { log_JoinLeft } = require(path.resolve('./config/channels'));
const { clientId } = require(path.resolve('./config/bot'));
const { memberLeftLog } = require(path.resolve('./data/i18n/members'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            if(member.user.id == clientId) { return; }

            const user   = member.user.tag;
            const userId = member.user.id;

            if(log_JoinLeft) {
                const sender_log = member.guild.channels.cache.get(log_JoinLeft);
                sender_log.send({
                    embeds: [{
                        color: 0xe35d5d,
                        title: memberLeftLog.title,
                        fields: [
                            { name: 'Usuario', value: user },
                            { name: 'User ID', value: userId }
                        ]
                    }]
                });
            }
        } catch(error) {
            console.error('[event:clientMemberRemove]', error.message);
        }
    }
};