const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Ver información del servidor.')
        .setDMPermission(false),
    async execute(interaction) {
        const info = interaction.member.guild;

        const tier = info.premiumTier;

        return interaction.reply({ embeds: [{
            color: 0xcc3366,
            title: `🔍 Información del servidor`,
            thumbnail: { url: "https://cdn.discordapp.com/icons/"+info.id+"/"+info.icon+".webp?size=256" },
            fields: [
                { name: '📦 Nombre', value: "```"+info.name+"```" },
                { name: '🧰 ID', value: "```"+info.id+"```" },
                { name: '👥 Miembros', value: "```"+info.memberCount+"```" },
                { name: '💎 Mejoras', value: "```Nivel: "+tier+" ("+info.premiumSubscriptionCount+" boosts)```" },
                { name: '👰🏻 Owner', value: "<@"+info.ownerId+">" },
                { name: '🗃 Canales', value: "```"+info.channels.cache.size+"```" },
                { name: '🎨 Roles', value: "```"+info.roles.cache.size+"```" }
            ]
        }] });
    }
};