// Load required resources =================================================================================================
const { Events, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

// Load configuration files ================================================================================================
const { welcomeChannel, log_JoinLeft } = require(path.resolve('./config/channels'));
const { clientId, welcomeHasImage, embedColor } = require(path.resolve('./config/bot'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if(member.user.id == clientId) { return; }

        const userTag = member.user.tag;
        const userId  = member.user.id;

        if(log_JoinLeft) {
            try {
                const sender_log = member.guild.channels.cache.get(log_JoinLeft);
                sender_log.send({
                    embeds: [{
                        color: 0x89db4f,
                        title: `👋🏻 Un usuario se acaba de unir al servidor`,
                        fields: [ { name: 'Usuario', value: userTag }, { name: 'User ID', value: userId } ]
                    }]
                });
            } catch(error) {
                console.error('[event:guildMemberAdd:log]', error.message);
            }
        }

        if(welcomeChannel) {
            try {
                const sender_welcome = member.guild.channels.cache.get(welcomeChannel);

                let filesAttach = [];
                if(welcomeHasImage) {
                    // Crear lienzo
                    const canvas = Canvas.createCanvas(700, 250);
                    const ctx = canvas.getContext('2d');

                    // Fondo de la imagen
                    const background = await Canvas.loadImage(path.resolve('./data/images/background_welcome.png'));
                    var x = 0;
                    var y = 0;
                    ctx.drawImage(background, 0, 0);

                    // Imagen de perfil
                    const pfp = await Canvas.loadImage((member.user.avatarURL({ format: 'png', size: 128 }).replace('webp', 'png'))); // it cannot recover png correctly
                    const radius = pfp.width > pfp.height ? pfp.height / 2 : pfp.width / 2;
                    const centerX = canvas.width / 2;
                    const centerY = 25 + radius;

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(pfp, centerX - radius, centerY - radius, radius * 2, radius * 2);
                    ctx.restore();

                    // Agregar texto
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '32px sans-serif';
                    let text = `Bienvenid@ ${member.user.tag}!`;
                    x = canvas.width / 2 - ctx.measureText(text).width / 2;
                    ctx.fillText(text, x, 60 + pfp.height);

                    // Display member count
                    ctx.font = '22px sans-serif';
                    text = `Eres el miembro #${member.guild.memberCount}`;
                    x = canvas.width / 2 - ctx.measureText(text).width / 2;
                    ctx.fillText(text, x, 100 + pfp.height);

                    // Adjuntar contenido multimedia
                    const mediaAttachment = new AttachmentBuilder(canvas.toBuffer(), 'img.png')

                    filesAttach =[ mediaAttachment ];
                }

                sender_welcome.send({
                    files: filesAttach,
                    embeds: [{
                        color: parseInt(embedColor, 16),
                        description:
                            `Bienvenido <@${userId}> al servidor 👋🏻 Esperamos disfrutes tu estadía en el servidor.\n\n`+
                            `**Sobre Mí:** <#637941772063866890>\n`+
                            `**Reglas del servidor:** <#751891992178327573>\n`+
                            `**Obtén roles geniales:** <#938245623495393300>`
                    }]
                });
            } catch(error) {
                console.error('[event:guildMemberAdd:welcome]', error.message);
            }
        }

    }
};
