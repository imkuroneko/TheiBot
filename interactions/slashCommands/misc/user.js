// Load required resources =================================================================================================
const { SlashCommandBuilder, UserFlagsBitField } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { embedColor } = require(path.resolve('./config/bot'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Ver información de un usuario.')
        .addUserOption(option => option.setName('target').setDescription('Selecciona un usuario'))
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('target');

        if(user) {
            var userId = user.id;
        } else {
            var userId = interaction.user.id;
        }

        interaction.client.users.fetch(userId).then((user) => {
            const unix_creacion = Math.floor(new Date(user.createdTimestamp).getTime() / 1000);
            const unix_join = Math.floor(new Date(interaction.member.joinedTimestamp).getTime() / 1000);

            return interaction.reply({ embeds: [{
                color: parseInt(embedColor, 16),
                title: `🔍 Acerca de ${user.username}`,
                fields: [
                    { inline: true, name: '🔢 ID Cuenta', value: `\`${user.id}\`` },
                    { inline: false, name: '👤 Usuario', value: `\`${user.username}#${user.discriminator}\`` },
                    { inline: false, name: '📅 Fecha de creación de la cuenta', value: `<t:${unix_creacion}:F> (<t:${unix_creacion}:R>)` },
                    { inline: false, name: '📥 Se unió al guild', value: `<t:${unix_join}:F> (<t:${unix_join}:R>)` },
                ],
                thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256` }
            }] });
        }).catch((error) => {
            console.error('[interaction:slashcmd:user]', error.message);
        });
    }
};
