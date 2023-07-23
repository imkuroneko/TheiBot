// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { embedColor } = require(path.resolve('./config/bot'));
const recetas = require(path.resolve('./data/json/misc/recipes.json'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('theicepedia')
        .setDescription('Recetas geniales que Thei colecciona para cualquier ocasión')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const receta = recetas[Math.floor(Math.random() * recetas.length)];
    
            return interaction.reply({ embeds: [{
                color: parseInt(embedColor, 16),
                title: "**📋 Receta**",
                description: `Oye <@${interaction.user.id}>, aquí tienes una de mis recetas favoritas!`,
                fields: [
                    { name: `**${receta.titulo}**`, value: "[Clic aquí]("+receta.enlace+")" }
                ],
                thumbnail: { url: `https://cdn.discordapp.com/emojis/919761441186254939.png?size=512&quality=lossless` }
            }] });
        } catch(error) {
            console.error('[interaction:slashcmd:theicepedia]', error.message);
        }
    }
};