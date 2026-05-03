// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { clientId } = require(path.resolve('./config/bot'));
const { memberLeftLog } = require(path.resolve('./data/i18n/members'));
const { GuildMemberLog, LogSetting } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            if(member.user.id == clientId) { return; }

            const user     = member.user.tag;
            const userId   = member.user.id;
            const leftAt   = Date.now();

            const logExit = await LogSetting.findOne({ where: { setting_name: 'log_user_exit' } });

            if(logExit?.setting_enabled && logExit?.setting_channel) {
                // Buscar el último registro de acceso sin fecha de salida
                let joinedAt = null;
                try {
                    const log = await GuildMemberLog.findOne({
                        where: { guild_id: member.guild.id, user_id: userId, left_at: null },
                        order: [['joined_at', 'DESC']],
                    });
                    if(log) {
                        joinedAt = log.joined_at;
                        await log.update({ left_at: leftAt });
                    }
                } catch(error) {
                    console.error('[event:guildMemberRemove:db]', error.message);
                }

                const fields = [
                    { name: 'Usuario', value: "`"+user+"`", inline: true },
                    { name: 'User ID', value: "`"+userId+"`", inline: true },
                ];

                if(joinedAt) {
                    const joinedDate = `<t:${Math.floor(joinedAt / 1000)}:F>`;
                    fields.push({ name: 'Se unió el', value: joinedDate, inline: false });
                }

                const sender_log = member.guild.channels.cache.get(logExit.setting_channel);
                sender_log.send({
                    embeds: [{
                        color: 0xe35d5d,
                        title: memberLeftLog.title,
                        fields,
                    }]
                });
            }
        } catch(error) {
            console.error('[event:clientMemberRemove]', error.message);
        }
    }
};