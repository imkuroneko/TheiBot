const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuggots')
        .setDescription('Just... nuggots')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            return interaction.reply('<:nuggots:864676232737718292> **Nuggots for the confederation!** <a:bongoThei:919759634087149608>');
        } catch (error) {
            console.error('[error] cmdSlash:nuggots |', error.message);
        }
    }
};