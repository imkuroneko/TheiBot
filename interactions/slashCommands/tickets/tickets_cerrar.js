// Load required resources =================================================================================================
const { color } = require('console-log-colors');
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { clientId } = require(path.resolve('./config/bot.json'));
const { staffRole } = require(path.resolve('./config/tickets.json'));
const { template } = require(path.resolve('./data/json/embeds.json'));

// Load SQLite Helper ======================================================================================================
const sqlite = require(path.resolve('./functions/tickets.js'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('cerrar')
        .setDescription('Cerrar Ticket')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const guildId  = interaction.guildId;
            const optionId = interaction.channelId;

            const validateTicket = await sqlite.isTicket(guildId, optionId);
            if(!validateTicket) {
                return interaction.reply({ content: 'Este canal no es un ticket', ephemeral: true });
            }

            const ticketInfo = await sqlite.getDataFromTicket(guildId, optionId);
            if(typeof ticketInfo == 'undefined') {
                return interaction.reply({
                    content: 'No se pudo obtener detalles del ticket porque no se encuentra registrado',
                    ephemeral: true
                });
            }

            const embed = [{
                color: parseInt(template.closed.color, 16),
                title: template.closed.title,
                description: template.closed.description
            }];

            const btns_ticket = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`reopenTicket;${optionId}`).setLabel('Reabrir Ticket').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId(`deleteTicket;${optionId}`).setLabel('Eliminar Ticket').setStyle(ButtonStyle.Danger),
            );

            interaction.reply({ embeds: embed, components: [ btns_ticket ] });

            await sqlite.updateStatus(guildId, optionId, 'closed');

            interaction.guild.channels.fetch(optionId).then( (channelEdit) => {
                var channelPermissions = [
                    { id: interaction.member.guild.roles.everyone.id, deny: [ 'ViewChannel', 'ReadMessageHistory' ] },
                    { id: clientId, allow: [ 'ViewChannel', 'ReadMessageHistory', 'SendMessages', 'ManageChannels', 'ManageMessages', 'ManageRoles' ] },
                    { id: ticketInfo.user, deny: [ 'ViewChannel', 'ReadMessageHistory', 'SendMessages' ] },
                ];

                if(typeof staffRole != 'undefined' && staffRole.length > 0 ) {
                    channelPermissions.push({ id: staffRole, allow: [ 'ViewChannel', 'ReadMessageHistory', 'SendMessages' ] });
                }

                channelEdit.edit({ permissionOverwrites: channelPermissions });
            });
        } catch(error) {
            console.error(color.red('[interaction:slashcmd:cerrar]'), error);
        }
    }
};