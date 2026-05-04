// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');
const { joinVoiceChannel } = require('@discordjs/voice');

// Load configuration files ================================================================================================
const config = require(path.resolve('./config/bot'));
const { LogSetting } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        try {
            if(newState.channelId == null && newState.member.id == config.clientId) {
                const logVoice = await LogSetting.findOne({ where: { setting_name: 'voice_presence' } });
                if(logVoice?.setting_enabled && logVoice?.setting_channel) {
                    const voiceChannelReconn = newState.guild.channels.cache.get(logVoice.setting_channel);
                    joinVoiceChannel({
                        channelId: voiceChannelReconn.id,
                        guildId: voiceChannelReconn.guild.id,
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