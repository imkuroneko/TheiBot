const channels = require('../config/channels.json');
const activity = require('../config/activity.json');

module.exports = {
    name: 'ready',
    execute(guild) {

        guild.user.setActivity("Hoomans en Discord™", { type: "WATCHING" });
        if(activity.length > 0) {
            var i = 0;
            setInterval(() => {
                i = (i + 1) % activity.length;
                guild.user.setActivity(activity[i].message, { type: activity[i].type });
            }, 60000);
        }

        if(channels.presenceVoice.length > 0) {
            const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
            const voiceChannel = guild.channels.cache.get(channels.presenceVoice);

            const conn = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: false
            });

            conn.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                try {
                    await Promise.race([
                        entersState(conn, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(conn, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch(error) {
                    // Seems to be a real disconnect which SHOULDN'T be recovered from
                    connection.destroy();
                }
            });
        }

        console.log('[Init] ✨ Bot operativo!');
    }
};
