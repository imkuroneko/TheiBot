// Load required resources =================================================================================================
const { Events, ActivityType } = require('discord.js');
const path = require('path');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

// Load configuration files ================================================================================================
const { presenceVoice } = require(path.resolve('./config/channels'));
const activity = require(path.resolve('./data/json/misc/activity.json'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.ClientReady,
    execute(client) {

        // Bot presence (status)
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
        } catch(error) {
            console.error('[event:base:ready:setPresence]', error.message);
        }

        // Bot presence (voice channel)
        try {
            if((typeof presenceVoice != 'undefined') && (presenceVoice.length > 0)) {
                const voiceChannel = client.channels.cache.get(presenceVoice);

                var conn = connectToVoice(voiceChannel);
                conn.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                    conn = connectToVoice(voiceChannel);
                });

                function connectToVoice(chn) {
                    return joinVoiceChannel({ channelId: chn.id, guildId: chn.guild.id, adapterCreator: chn.guild.voiceAdapterCreator, selfDeaf: false });
                }
            }
        } catch(error) {
            console.error('[event:base:ready:voicePresence]', error.message);
        }
    }
};
