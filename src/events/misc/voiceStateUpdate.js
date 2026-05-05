// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

// Load configuration files ================================================================================================
const config = require(path.resolve('./config/bot'));
const { LogSetting } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        try {
            const isBot        = newState.member?.id === config.clientId;
            const leftChannel  = oldState.channelId != null && newState.channelId == null;

            if (isBot && leftChannel) {
                const logVoice = await LogSetting.findOne({ where: { setting_name: 'voice_presence' } });
                if(logVoice?.setting_enabled && logVoice?.setting_channel) {
                    const existing = getVoiceConnection(newState.guild.id);
                    if (existing) existing.destroy();

                    const voiceChannelReconn = newState.guild.channels.cache.get(logVoice.setting_channel);
                    if (!voiceChannelReconn) { return; }

                    joinVoiceChannel({
                        channelId:      voiceChannelReconn.id,
                        guildId:        voiceChannelReconn.guild.id,
                        adapterCreator: voiceChannelReconn.guild.voiceAdapterCreator,
                        selfDeaf: false
                    });
                }
            }
        } catch(error) {
            console.error('[event:voiceStateUpdate]', error.message);
        }
    }
};