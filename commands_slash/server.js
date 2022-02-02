const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Ver información del servidor.'),
    async execute(interaction) {
        const info = interaction.member.guild;

        const guild_id        = info.id;
        const guild_icon      = info.icon;
        const guild_name      = info.name;
        const guild_owner     = info.ownerId;
        const guild_level     = info.premiumTier === 0 ? info.premiumTier : info.premiumTier.replace('TIER_', '');
        const guild_boost     = info.premiumSubscriptionCount;
        const guild_members   = info.memberCount;
        const guild_channels  = info.channels.cache.size;
        const guild_roles     = info.roles.cache.size;

        return interaction.reply({ embeds: [{
            color: 0xcc3366,
            title: `🔍 Información del servidor`,
            thumbnail: { url: "https://cdn.discordapp.com/icons/"+guild_id+"/"+guild_icon+".webp?size=256" },
            fields: [
                { name: '📦 Nombre', value: "```"+guild_name+"```" },
                { name: '🧰 ID', value: "```"+guild_id+"```" },
                { name: '👥 Miembros', value: "```"+guild_members+"```" },
                { name: '💎 Mejoras', value: "```Nivel: "+guild_level+" / Boosts: "+guild_boost+"```" },
                { name: '👰🏻 Owner', value: "<@"+guild_owner+">" },
                { name: '🗃 Canales', value: "```"+guild_channels+"```" },
                { name: '🎨 Roles', value: "```"+guild_roles+"```" }
            ]
        }] });
    }
};