const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Ver información de tu cuenta.'),
    async execute(interaction) {
        const username = interaction.user.username;
        const discriminator = interaction.user.discriminator;
        const id = interaction.user.id;
        const avatar = interaction.user.avatar;
        const date_creation = new Date(interaction.user.createdTimestamp).toLocaleDateString("en-US")+' a las '+new Date(interaction.user.createdTimestamp).toLocaleTimeString("en-US");

        return interaction.reply({ embeds: [{
            color: 0xcc3366,
            title: `🔍 Información de tu cuenta`,
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
