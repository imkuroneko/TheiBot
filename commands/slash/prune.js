// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { ownerId }  = require(path.resolve('./config/bot.json'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Borrar mensajes de este canal.')
        .addIntegerOption(option => option.setName('cantidad').setDescription('Número de mensajes a borrar (hasta 50)'))
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const cantidad = interaction.options.getInteger('cantidad');

            if(isNaN(cantidad)) {
                return interaction.reply({ content: 'Debes escribir un número...', ephemeral: true });
            }

            if(interaction.user.id != ownerId) {
                return interaction.reply({ content: 'No tienes permiso para utilizar este comando hooman...', ephemeral: true });
            }

            if(cantidad < 1 || cantidad > 50) {
                return interaction.reply({ content: '❌ Hooman... solo puedo borrar hasta 50 mensajes a la vez.', ephemeral: true });
            }

            await interaction.channel.bulkDelete(cantidad, true).catch(error => {
                console.error(error);
                interaction.reply({ content: 'Hubo un inconveniente al borrar los mensajes.', ephemeral: true });
            });

            return interaction.reply({ content: `Se han borrado exitosamente \`${cantidad}\` mensajes.`, ephemeral: true });
        } catch(error) {
            console.error('cmdSlash:prune |', error.message);
        }
    },
};