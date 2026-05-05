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
        .setName('config')
        .setDescription('Configurar canales y detalles menores del bot')
        .addStringOption(option => option
            .setName('configuracion')
            .setDescription('Qué configuración deseas ajustar')
            .setRequired(true)
            .addChoices(
                ...LOG_SETTINGS_SEED.map(s => ({ name: s.setting_description, value: s.setting_name }))
            )
        )
        .addStringOption(option => option
            .setName('habilitado')
            .setDescription('Activar o desactivar este log')
            .setRequired(true)
            .addChoices(
                { name: 'si', value: 'si' },
                { name: 'no', value: 'no' }
            )
        )
        .addChannelOption(option => option
            .setName('canal_texto')
            .setDescription('Canal de texto donde se enviarán los logs (para logs de texto)')
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => option
            .setName('canal_voz')
            .setDescription('Canal de voz del bot (solo para "Canal de voz del bot")')
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildVoice)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const setting_name = interaction.options.getString('configuracion');
            const enabled      = interaction.options.getString('habilitado') === 'si';
            const isVoiceSetting = setting_name === 'voice_presence';
            const channel = isVoiceSetting
                ? interaction.options.getChannel('canal_voz')
                : interaction.options.getChannel('canal_texto');

            const updateData = { setting_enabled: enabled };
            if (channel) updateData.setting_channel = channel.id;

            await LogSetting.update(updateData, { where: { setting_name } });

            const record = await LogSetting.findOne({ where: { setting_name } });

            return interaction.reply({ embeds: [{
                color: parseInt(embedColor, 16),
                title: '⚙️ Configuración de logs actualizada',
                fields: [
                    { name: 'Configuración', value: `\`${record.setting_name}\``,                                             inline: true },
                    { name: 'Estado',        value: record.setting_enabled ? '✅ Habilitado' : '❌ Deshabilitado',           inline: true },
                    { name: 'Canal',         value: record.setting_channel ? `<#${record.setting_channel}>` : '`Sin canal`',  inline: true },
                ]
            }], ephemeral: true });
        } catch (error) {
            console.error('[interaction:slashcmd:logconfig]', error.message);
        }
    }
};