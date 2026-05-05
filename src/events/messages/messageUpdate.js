// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');

// Load custom functions ===================================================================================================
const { LogSetting } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        try {
            if (newMessage.author?.bot) { return; }

            // Ignorar si el contenido no cambió (p.ej. edición de embed por Discord)
            if (oldMessage.content === newMessage.content) { return; }

            const setting = await LogSetting.findOne({ where: { setting_name: 'log_messages_edit' } });
            if (!setting?.setting_enabled || !setting?.setting_channel) { return; }

            const channel = newMessage.guild?.channels.cache.get(setting.setting_channel);
            if (!channel) { return; }

            channel.send({
                embeds: [{
                    color: 0xfaa61a,
                    title: '✏️ Mensaje editado',
                    fields: [
                        { name: 'Autor',        value: `<@${newMessage.author.id}> \`${newMessage.author.tag}\``,          inline: true },
                        { name: 'Canal',        value: `<#${newMessage.channel.id}>`,                                      inline: true },
                        { name: 'Antes',        value: oldMessage.content?.slice(0, 1024) || '*(no disponible)*',          inline: false },
                        { name: 'Después',      value: newMessage.content?.slice(0, 1024) || '*(sin contenido de texto)*', inline: false },
                    ],
                    footer: { text: `ID de mensaje: ${newMessage.id}` },
                    timestamp: new Date().toISOString(),
                }]
            });
        } catch (error) {
            console.error('[event:messages:messageUpdate]', error.message);
        }
    }
};
