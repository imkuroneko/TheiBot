const config  = require('../../config/bot.json');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear_chat')
        .setDescription('Borrar mensajes de este canal.')
        .addIntegerOption(option => option.setName('cantidad').setDescription('Número de mensajes a borrar (hasta 50)'))
        .setDMPermission(false),
    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');

        if(isNaN(cantidad)) {
            return interaction.reply({ content: 'Debes escribir un número...', ephemeral: true });
        }

        if(cantidad < 1 || cantidad > 50) {
            return interaction.reply({ content: '<:theiFaka:925597678086283294> Hooman... solo puedo borrar hasta 50 mensajes a la vez.', ephemeral: true });
        }

        if(interaction.user.id != config.ownerId) {
            return interaction.reply({ content: '<:theiFaka:925597678086283294> No tienes permiso para utilizar este comando hooman...', ephemeral: true });
        }

        await interaction.channel.bulkDelete(cantidad, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'Hubo un inconveniente al borrar los mensajes.', ephemeral: true });
        });

        return interaction.reply({ content: `Se han borrado exitosamente \`${cantidad}\` mensajes.`, ephemeral: true });
    },
};