// Load required resources =================================================================================================
const { color } = require('console-log-colors');
const { SlashCommandBuilder } = require('discord.js');

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('acercade')
        .setDescription('Acerca de Thei')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            return interaction.reply({ embeds: [{
                color: 0x4f30b3,
                title: '🦄 TheiBot v3',
                description: "_*happy unicorn sounds_\n\nPequeño bot utilitario multitasks para Discord.\n**Desarrollado por:** [@KuroNeko](https://github.com/imkuroneko)",
            }] });
        } catch(error) {
            console.error(color.red('[interaction:slashcmd:acercade]'), error.message);
        }
    }
};