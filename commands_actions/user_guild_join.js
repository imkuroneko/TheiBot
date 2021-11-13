const channels = require('../config/channels.json');
const { Client, Intents } = require('discord.js');
const client = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents:  [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]
});

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const user     = member.user.tag;
        const userId   = member.user.id;
        const username = member.user.username;
        const avatar   = member.user.displayAvatarURL();

        if(config.welcomeChannel.length > 0) {
            const sender_welcome = client.channels.cache.find(channel => channel.id == channels.welcomeChannel);
            sender_welcome.send({ embeds: [{
                color: 0xcc3366,
                title: 'Bienvenido '+username+' al servidor 👋🏻',
                description: "Esperamos que disfrutes tu estadía en el servidor.",
                thumbnail: { url: avatar },
                fields: [
                    { name: '• Las reglas de mi comunidad', value: '<#751891992178327573>' },
                    { name: '• Roles Chidoris y para alertas', value: '<#580615018261774346>' },
                    { name: '• Sobre Mí y mis redes sociales', value: '<#637941772063866890>' }
                ],
                footer: config.embeds.footer
            }] });
        }

        if(config.log_JoinLeft.length > 0) {
            const sender_log = client.channels.cache.find(channel => channel.id == channels.log_JoinLeft);
            sender_log.send({ embeds: [{
                color: 0x89db4f,
                title: `👋🏻 Un usuario se acaba de unir al servidor`,
                fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
                thumbnail: { url: avatar },
                footer: config.embeds.footer
            }] });
        }
    }
};