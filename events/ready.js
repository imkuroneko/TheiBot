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

            var conn = connectToVoice(voiceChannel);

            conn.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                conn = connectToVoice(voiceChannel);
            });

            function connectToVoice(channel) {
                return joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
            }
        }

        console.log('[Init] Bot operativo!');
    }
};
