const channels = require('../config/channels.json');
const config = require('../config/bot.json');
const roles = require('../config/roles.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, user) {

        if(client.user.id == config.clientId) { return; }

        const userTag  = client.user.tag;
        const userId   = client.user.id;
        const username = client.user.username;
        const avatar   = client.user.displayAvatarURL();

        if(roles.roleWhenJoin.length > 0 ) {
            client.user.roles.add(roles.roleWhenJoin);
        }

        if(channels.welcomeChannel.length > 0) {
            const sender_welcome = client.guild.channels.cache.get(channels.welcomeChannel);
            sender_welcome.send({ embeds: [{
                color: 0xcc3366,
                title: `Bienvenido <@${userId}> al servidor 👋🏻 Esperamos disfrutes tu estadía en el servidor.`,
                description: "**Sobre Mí:** <#637941772063866890>\n**Reglas del servidor:** <#751891992178327573>\n**Obtén roles geniales:** <#938245623495393300>"
            }] });
        }

        if(channels.log_JoinLeft.length > 0) {
            const sender_log = client.guild.channels.cache.get(channels.log_JoinLeft);
            sender_log.send({ embeds: [{
                color: 0x89db4f,
                title: `👋🏻 Un usuario se acaba de unir al servidor`,
                fields: [ { name: 'Usuario', value: userTag }, { name: 'User ID', value: userId } ]
            }] });
        }
    }
};
