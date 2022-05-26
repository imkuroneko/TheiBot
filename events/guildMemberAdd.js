const channels = require('../config/channels.json');
const roles = require('../config/roles.json');
const config = require('../config/bot.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(client) {

        if(member.user.id == config.clientId) { return; }

        if(roles.roleWhenJoin.length > 0 ) {
            client.roles.add(roles.roleWhenJoin);
        }

        const userTag  = client.user.tag;
        const userId   = client.user.id;
        const username = client.user.username;
        const avatar   = client.user.displayAvatarURL();

        if(channels.welcomeChannel.length > 0) {
            const sender_welcome = member.guild.channels.cache.get(channels.welcomeChannel);
            sender_welcome.send({ embeds: [{
                color: 0xcc3366,
                description: `Bienvenido <@${userId}> al servidor 👋🏻 Esperamos disfrutes tu estadía en el servidor.\n\n**Sobre Mí:** <#637941772063866890>\n**Reglas del servidor:** <#751891992178327573>\n**Obtén roles geniales:** <#938245623495393300>`
            }] });
        }

        if(channels.log_JoinLeft.length > 0) {
            const sender_log = member.guild.channels.cache.get(channels.log_JoinLeft);
            sender_log.send({ embeds: [{
                color: 0x89db4f,
                title: `👋🏻 Un usuario se acaba de unir al servidor`,
                fields: [ { name: 'Usuario', value: userTag }, { name: 'User ID', value: userId } ]
            }] });
        }
    }
};
