const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Ver información de un usuario.')
        .addUserOption(option => option.setName('target').setDescription('Selecciona un usuario'))
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('target');

        if(user) {
            var userInfo = user;
        } else {
            var userInfo = interaction.user;
        }

        const username = userInfo.username;
        const discriminator = userInfo.discriminator;
        const id = userInfo.id;
        const avatar = userInfo.avatar;
        const date_creation = new Date(userInfo.createdTimestamp).toLocaleDateString("en-US")+' a las '+new Date(userInfo.createdTimestamp).toLocaleTimeString("en-US");

        return interaction.reply({ embeds: [{
            color: 0xcc3366,
            title: `🔍 Información de la cuenta`,
            fields: [
                { name: '👤 Usuario', value: "```"+username+"#"+discriminator+"```" },
                { name: '🔢 ID Cuenta', value: "```"+id+"```" },
                { name: '🌆 ID Avatar', value: "```"+avatar+"```" },
                { name: '📅 Fecha Creación', value: "```"+date_creation+"```" },
            ],
            thumbnail: { url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=256` }
        }] });
    }
};
