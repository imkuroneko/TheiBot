const channels = require('../config/channels.json');
const activity = require('../config/activity.json');

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

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
            const { joinVoiceChannel } = require('@discordjs/voice');
            const voiceChannel = guild.channels.cache.get(channels.presenceVoice);

            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }

        console.log('[Init] ✨ Bot operativo!');
    }
};
