// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { welcomeChannel, log_JoinLeft } = require(path.resolve('./config/channels.json'));
const { clientId } = require(path.resolve('./config/bot.json'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {

            if(member.user.id == clientId) { return; }

            const userTag = member.user.tag;
            const userId  = member.user.id;

            if(welcomeChannel.length > 0) {
                const sender_welcome = member.guild.channels.cache.get(welcomeChannel);
                sender_welcome.send({ embeds: [{
                    color: 0xcc3366,
                    description:
                        `Bienvenido <@${userId}> al servidor 👋🏻 Esperamos disfrutes tu estadía en el servidor.\n\n
                        **Sobre Mí:** <#637941772063866890>\n
                        **Reglas del servidor:** <#751891992178327573>\n
                        **Obtén roles geniales:** <#938245623495393300>
                    `
                }] });
            }

            if(log_JoinLeft.length > 0) {
                const sender_log = member.guild.channels.cache.get(log_JoinLeft);
                sender_log.send({ embeds: [{
                    color: 0x89db4f,
                    title: `👋🏻 Un usuario se acaba de unir al servidor`,
                    fields: [ { name: 'Usuario', value: userTag }, { name: 'User ID', value: userId } ]
                }] });
            }
        } catch(error) {
            console.error('event:guildMemberAdd |', error.message);
        }
    }
};
