const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuggots')
        .setDescription('Just... nuggots'),
    async execute(interaction) {
        return interaction.reply('<:nuggots:864676232737718292> **Nuggots for the confederation!** <a:bongoThei:919759634087149608>');
    }
};