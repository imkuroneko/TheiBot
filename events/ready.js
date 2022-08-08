const channels = require('../config/channels.json');
const activity = require('../data/activity.json');

const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    execute(client) {

        try {
            client.user.setPresence({
                activities: [{ name: "Hoomans en Discord™️", type: ActivityType.Watching }],
                status: 'dnd',
            });

            if(activity.length > 0) {
                var i = 0;
                setInterval(() => {
                    i = (i + 1) % activity.length;

                    switch(activity[i].type.toLowerCase()) {
                        case 'competing': type = ActivityType.Competing; break;
                        case 'listening': type = ActivityType.Listening; break;
                        case 'streaming': type = ActivityType.Streaming; break;
                        case 'playing':   type = ActivityType.Playing; break;
                        case 'watching':  type = ActivityType.Watching; break;
                        default: type = ActivityType.Watching; break;
                    }

                    client.user.setPresence({
                        activities: [{ name: activity[i].message, type: type }],
                        status: 'dnd',
                    });
                }, 60000);
            }

            if(channels.presenceVoice.length > 0) {
                const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
                const voiceChannel = client.channels.cache.get(channels.presenceVoice);

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
        } catch(error) {
            console.error('[error] event:ready |', error.message);
        }

        console.log('[init] Bot operativo!');
    }
};