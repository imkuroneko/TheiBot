const channels = require('../config/channels.json');

module.exports = {
    name: 'guildMemberRemove',
    async execute(client, user) {
        var user     = client.user.tag;
        var userId   = client.user.id;
        var username = client.user.username;
        var avatar   = client.user.displayAvatarURL();

        if(channels.log_JoinLeft.length > 0) {
            const sender_log = client.guild.channels.cache.get(channels.log_JoinLeft);
            sender_log.send({ embeds: [{
                color: 0xe35d5d,
                title: `👋🏻 Un usuario se acaba de ir del servidor`,
                fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
                // thumbnail: { url: avatar },
                footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
            }] });
        }
    }
};
