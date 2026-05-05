// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');

// Load custom functions ===================================================================================================
const { LogSetting } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            if (message.author?.bot) { return; }

            const setting = await LogSetting.findOne({ where: { setting_name: 'log_messages_send' } });
            if (!setting?.setting_enabled || !setting?.setting_channel) { return; }

            const channel = message.guild?.channels.cache.get(setting.setting_channel);
            if (!channel) { return; }

            channel.send({
                embeds: [{
                    color: 0x5865f2,
                    title: '📨 Mensaje enviado',
                    fields: [
                        { name: 'Autor',   value: `<@${message.author.id}> \`${message.author.tag}\``, inline: true },
                        { name: 'Canal',   value: `<#${message.channel.id}>`,                          inline: true },
                        { name: 'Mensaje', value: message.content?.slice(0, 1024) || '*(sin contenido de texto)*', inline: false },
                    ],
                    footer: { text: `ID de mensaje: ${message.id}` },
                    timestamp: new Date().toISOString(),
                }]
            });
        } catch (error) {
            console.error('[event:messages:messageCreate]', error.message);
        }
    }
};
