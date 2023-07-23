// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const wait = require('node:timers/promises').setTimeout;

// Load configuration files ================================================================================================
const { secDelTicket } = require(path.resolve('./config/tickets'));
const { template } = require(path.resolve('./data/json/i18n/tickets.json'));

// Load SQLite Helper ======================================================================================================
const sqlite = require(path.resolve('./functions/tickets.js'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('eliminar')
        .setDescription('Eliminar Ticket')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const guildId  = interaction.guildId;
            const optionId = interaction.channelId;

            const validateTicket = await sqlite.isTicket(guildId, optionId);
            if(!validateTicket) {
                return interaction.reply({ content: 'Este canal no es un ticket!', ephemeral: true });
            }

            const ticketInfo = await sqlite.getDataFromTicket(guildId, optionId);
            if(typeof ticketInfo == 'undefined') {
                return interaction.reply({
                    content: 'No se pudo obtener detalles del ticket porque no se encuentra registrado',
                    ephemeral: true
                });
            }

            const embed = [{
                color: parseInt(template.delete.color, 16),
                title: template.delete.title,
                description: template.delete.description.replaceAll('{seconds}', secDelTicket)
            }];

            interaction.reply({ embeds: embed });

            await wait(secDelTicket * 1000);

            await sqlite.updateStatus(guildId, optionId, 'deleted');

            const channelDel = await interaction.guild.channels.cache.get(optionId);
            channelDel.delete();
        } catch(error) {
            console.error('[interaction:slashcmd:ticket:eliminar]', error.message);
        }
    }
};