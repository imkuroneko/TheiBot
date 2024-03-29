// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription('Enviar un embed en este canal. (Herramienta disponible en kuroneko.im/tools)')
        .addStringOption(option => option.setName('embed').setDescription('El embed a enviar').setRequired(true))
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const embed = interaction.options.getString('embed');

            if(!embed) {
                return interaction.reply({ content: '🚨 embed no válido', ephemeral: true });
            }

            if(!(isJsonString(embed))) {
                return interaction.reply({ content: 'Este embed no tiene un formato válido.', ephemeral: true });
            }

            const channel = interaction.client.channels.cache.find(channel => channel.id == interaction.channelId);
            channel.send(JSON.parse(embed));

            return interaction.reply({ content: '🦄 listo!', ephemeral: true });

            function isJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }
        } catch(error) {
            console.error('[interaction:slashcmd:sendembed]', error.message);
        }
    }
};