// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuggots')
        .setDescription('Just... nuggots')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            return interaction.reply('**Nuggots for the confederation!** 🍗');
        } catch(error) {
            console.error('[interaction:slashcmd:nuggots]', error.message);
        }
    }
};