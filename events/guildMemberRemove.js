const channels = require('../config/channels.json');
const config = require('../config/bot.json');

module.exports = {
    name: 'guildMemberRemove',
    async execute(client) {

        if(client.user.id == config.clientId) { return; }

        var user     = client.user.tag;
        var userId   = client.user.id;

        if(channels.log_JoinLeft.length > 0) {
            const sender_log = client.guild.channels.cache.get(channels.log_JoinLeft);
            sender_log.send({ embeds: [{
                color: 0xe35d5d,
                title: `👋🏻 Un usuario se acaba de ir del servidor`,
                fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
            }] });
        }
    }
};
