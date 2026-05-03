// Load required resources =================================================================================================
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { embedColor } = require(path.resolve('./config/bot'));

// Load custom functions ===================================================================================================
const { LogSetting, LOG_SETTINGS_SEED } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('logconfig')
        .setDescription('Configurar los canales de logs del servidor')
        .addStringOption(option => option
            .setName('Configuracion')
            .setDescription('Qué configuración deseas ajustar')
            .setRequired(true)
            .addChoices(
                ...LOG_SETTINGS_SEED.map(s => ({ name: s.setting_description, value: s.setting_name }))
            )
        )
        .addBooleanOption(option => option
            .setName('Habilitado')
            .setDescription('Activar o desactivar este log')
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName('Canal')
            .setDescription('Canal donde se enviarán los logs')
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const setting_name = interaction.options.getString('Configuracion');
            const enabled      = interaction.options.getBoolean('Habilitado');
            const channel      = interaction.options.getChannel('Canal');

            const updateData = { setting_enabled: enabled };
            if (channel) updateData.setting_channel = channel.id;

            await LogSetting.update(updateData, { where: { setting_name } });

            const record = await LogSetting.findOne({ where: { setting_name } });

            return interaction.reply({ embeds: [{
                color: parseInt(embedColor, 16),
                title: '⚙️ Configuración de logs actualizada',
                fields: [
                    { name: 'Configuración', value: `\`${record.setting_name}\``,                                             inline: true },
                    { name: 'Estado',        value: record.setting_enabled ? '✅ Habilitado' : '❌ Deshabilitado',            inline: true },
                    { name: 'Canal',         value: record.setting_channel ? `<#${record.setting_channel}>` : '`Sin canal`',  inline: true },
                ]
            }], ephemeral: true });
        } catch (error) {
            console.error('[interaction:slashcmd:logconfig]', error.message);
        }
    }
};
