// Load required resources =================================================================================================
const { Events, ActivityType } = require('discord.js');
const path = require('path');
const { joinVoiceChannel } = require('@discordjs/voice');

// Load configuration files ================================================================================================
const { LogSetting, BotActivity } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        // Bot presence (status)
        try {
            const TYPE_MAP = {
                competing: ActivityType.Competing,
                listening: ActivityType.Listening,
                streaming: ActivityType.Streaming,
                playing:   ActivityType.Playing,
                watching:  ActivityType.Watching,
            };

            function applyActivity(entry) {
                client.user.setPresence({
                    activities: [{ name: entry.message, type: TYPE_MAP[entry.type.toLowerCase()] ?? ActivityType.Watching }],
                    status: 'dnd',
                });
            }

            let lastId = null;

            async function rotateActivity() {
                const all = await BotActivity.findAll();
                if (!all.length) { return; }

                const pool = all.length > 1 ? all.filter(a => a.id !== lastId) : all;
                const pick = pool[Math.floor(Math.random() * pool.length)];
                lastId = pick.id;
                applyActivity(pick);
            }

            await rotateActivity();
            setInterval(rotateActivity, 60_000);
        } catch(error) {
            console.error('[event:base:ready:setPresence]', error.message);
        }

        // Bot presence (voice channel)
        try {
            const voicePresence = await LogSetting.findOne({ where: { setting_name: 'voice_presence' } });
            if(voicePresence?.setting_enabled && voicePresence?.setting_channel) {
                const voiceChannel = client.channels.cache.get(voicePresence.setting_channel);
                connectToVoice(voiceChannel);

                function connectToVoice(chn) {
                    return joinVoiceChannel({
                        channelId: chn.id,
                        guildId: chn.guild.id,
                        adapterCreator: chn.guild.voiceAdapterCreator,
                        selfDeaf: false
                    });
                }
            }
        } catch(error) {
            console.error('[event:base:ready:voicePresence]', error.message);
        }
    }
};