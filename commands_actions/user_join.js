const channels = require('../config/channels.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, user) {
        var user     = client.user.tag;
        var userId   = client.user.id;
        var username = client.user.username;
        var avatar   = client.user.displayAvatarURL();

        if(channels.welcomeChannel.length > 0) {
            const sender_welcome = client.guild.channels.cache.get(channels.welcomeChannel);
            sender_welcome.send({ embeds: [{
                color: 0xcc3366,
                title: 'Bienvenido '+username+' al servidor 👋🏻',
                description: "Esperamos que disfrutes tu estadía en el servidor.",
                fields: [
                    { name: '• Las reglas de mi comunidad', value: '<#751891992178327573>' },
                    // { name: '• Roles Chidoris y para alertas', value: '<#580615018261774346>' },
                    { name: '• Sobre Mí y mis redes sociales', value: '<#637941772063866890>' }
                ],
                footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
            }] });
        }
    
        if(channels.log_JoinLeft.length > 0) {
            const sender_log = client.guild.channels.cache.get(channels.log_JoinLeft);
            sender_log.send({ embeds: [{
                color: 0x89db4f,
                title: `👋🏻 Un usuario se acaba de unir al servidor`,
                fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
                footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
            }] });
        }
    }
};
