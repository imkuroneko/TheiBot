const channels = require('../config/channels.json');
const { Client, Intents } = require('discord.js');
const client = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents:  [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]
});

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const user   = member.user.tag;
        const userId = member.user.id;
        const avatar = member.user.displayAvatarURL();

        if(config.log_JoinLeft.length > 0) {
            const sender_log = client.channels.cache.find(channel => channel.id == channels.log_JoinLeft);
            sender_log.send({ embeds: [{
                color: 0xe35d5d,
                title: `👋🏻 Un usuario se acaba de ir del servidor`,
                fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
                thumbnail: { url: avatar },
                footer: config.embeds.footer
            }] });
        }
    }
};