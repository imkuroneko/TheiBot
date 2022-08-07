const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('theicepedia')
        .setDescription('Recetas geniales que Thei colecciona para cualquier ocasión')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const recetas = require('../../data/recetas.json');
            const receta = recetas[Math.floor(Math.random() * recetas.length)];
    
            return interaction.reply({ embeds: [{
                color: 0xcc3366,
                title: "**📋 Receta**",
                description: `Oye <@${interaction.user.id}>, aquí tienes una de mis recetas favoritas!`,
                fields: [
                    { name: `**${receta.titulo}**`, value: "[Clic aquí]("+receta.enlace+")" }
                ],
                thumbnail: { url: `https://cdn.discordapp.com/emojis/919761441186254939.png?size=512&quality=lossless` }
            }] });
        } catch (error) {
            console.error('[error] cmdSlash:theicepedia |', error.message);
        }
    }
};