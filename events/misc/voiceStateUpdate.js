// Load required resources =================================================================================================
const { Events } = require('discord.js');
const path = require('path');
const { joinVoiceChannel } = require('@discordjs/voice');

// Load configuration files ================================================================================================
const channels = require(path.resolve('./config/channels'));
const config = require(path.resolve('./config/bot'));

// Module script ===========================================================================================================
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        try {
            if((newState.channelID === null || typeof newState.channelID == 'undefined') && newState.id == config.clientId) {
                if(channels.presenceVoice) {
                    const voiceChannelReconn = newState.guild.channels.cache.get(channels.presenceVoice);
                    joinVoiceChannel({
                        channelId: voiceChannelReconn.id,
                        guildId: voiceChannelReconn.guild.id,
                        adapterCreator: voiceChannelReconn.guild.voiceAdapterCreator,
                        selfDeaf: false
                    });
                }
            }
        } catch(error) {
            console.error('event:voiceStateUpdate |', error.message);
        }
    }
};
