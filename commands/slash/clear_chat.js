const config  = require('../../config/bot.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear_chat')
        .setDescription('Borrar mensajes de este canal.')
        .addIntegerOption(option => option.setName('amount').setDescription('Número de mensajes a borrar (hasta 50)')),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if(isNaN(amount)) {
            return interaction.reply({ content: 'Debes escribir un número...', ephemeral: true });
        }

        if(amount < 1 || amount > 50) {
            return interaction.reply({ content: '<:theiFaka:925597678086283294> Hooman... solo puedo borrar hasta 50 mensajes a la vez.', ephemeral: true });
        }

        if(interaction.user.id != config.ownerId) {
            return interaction.reply({ content: '<:theiFaka:925597678086283294> No tienes permiso para utilizar este comando hooman...', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'Hubo un inconveniente al borrar los mensajes.', ephemeral: true });
        });

        return interaction.reply({ content: `Se han borrado exitosamente \`${amount}\` mensajes.`, ephemeral: true });
    },
};