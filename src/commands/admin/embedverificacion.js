// Load required resources =================================================================================================
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { ownerId } = require(path.resolve('./config/bot'));
const { defaultRole } = require(path.resolve('./config/roles'));

// Module script ===========================================================================================================
exports.run = (client, message, args) => {
    try {
        message.delete();

        if(message.author.id != ownerId) { return; }

        message.channel.send({
            embeds: [
                {
                    color: 0x941835,
                    title: "**⚖ Reglas**",
                    description: "Encontrarás las reglas de nuestra comunidad en <#751891992178327573>, recuerda seguirlas porque __el incumplimiento de estas es pasible de sanción__"
                },
                {
                    color: 0x941835,
                    title: "**🚔 Verificación**",
                    description: `Para obtener el rol de <@&${defaultRole}> y acceder a nuestro Discord, haz clic en el botón de abajo`
                },
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`securityCheck;${defaultRole}`).setLabel('Verificarme').setStyle(ButtonStyle.Primary).setEmoji('✔')
                )
            ]
        });
    } catch(error) {
        console.error('cmdPrefix:embedVerificacion | ', error.message);
    }
}