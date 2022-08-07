const channels = require('../config/channels.json');
const config = require('../config/bot.json');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        try {
            if((newState.channelID === null || typeof newState.channelID == 'undefined') && newState.id == config.clientId) {
                if(channels.presenceVoice.length > 0) {
                    const { joinVoiceChannel } = require('@discordjs/voice');
                    const voiceChannelReconn = newState.guild.channels.cache.get(channels.presenceVoice);
                    joinVoiceChannel({
                        channelId: voiceChannelReconn.id,
                        guildId: voiceChannelReconn.guild.id,
                        adapterCreator: voiceChannelReconn.guild.voiceAdapterCreator,
                        selfDeaf: false
                    });
                }
            }
        } catch (error) {
            console.error('[error] event:voiceStateUpdate |', error.message);
        }
    }
};
