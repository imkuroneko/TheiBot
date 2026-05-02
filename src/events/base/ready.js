// Load required resources =================================================================================================
const { Events, ActivityType } = require('discord.js');
const path = require('path');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

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

                    let type;
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
                connectToVoice(voiceChannel);

                function connectToVoice(chn) {
                    const conn = joinVoiceChannel({ channelId: chn.id, guildId: chn.guild.id, adapterCreator: chn.guild.voiceAdapterCreator, selfDeaf: false });

                    conn.on(VoiceConnectionStatus.Disconnected, async () => {
                        try {
                            // Esperar hasta 5s a que Discord reconecte solo (ej: corte de red breve)
                            await Promise.race([
                                entersState(conn, VoiceConnectionStatus.Signalling, 5_000),
                                entersState(conn, VoiceConnectionStatus.Connecting, 5_000),
                            ]);
                        } catch {
                            // No se recuperó → destruir y reconectar desde cero
                            if(conn.state.status !== VoiceConnectionStatus.Destroyed) {
                                conn.destroy();
                            }
                            connectToVoice(chn);
                        }
                    });

                    return conn;
                }
            }
        } catch(error) {
            console.error('[event:base:ready:voicePresence]', error.message);
        }
    }
};
