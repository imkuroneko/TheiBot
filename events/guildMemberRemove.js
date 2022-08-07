const channels = require('../config/channels.json');
const config = require('../config/bot.json');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            if(member.user.id == config.clientId) { return; }

            var user     = member.user.tag;
            var userId   = member.user.id;
            var username = member.user.username;
            var avatar   = member.user.displayAvatarURL();

            if(channels.log_JoinLeft.length > 0) {
                const sender_log = member.guild.channels.cache.get(channels.log_JoinLeft);
                sender_log.send({ embeds: [{
                    color: 0xe35d5d,
                    title: `👋🏻 Un usuario se acaba de ir del servidor`,
                    fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
                    // thumbnail: { url: avatar },
                    footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
                }] });
            }
        } catch (error) {
            console.error('[error] event:clientMemberRemove |', error.message);
        }
    }
};
