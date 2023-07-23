// Load required resources =================================================================================================
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const path = require('path');

// Load custom functions ===================================================================================================
const twitch = require(path.resolve('./functions/twitch'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('twitchdel')
        .setDescription('Eliminar un canal de Twitch')
        .addStringOption(option => option.setName('tw_canal').setDescription('Canal de twitch').setRequired(true).setMinLength(1).setMaxLength(25))
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const tw_canal = (interaction.options.getString('tw_canal').replace(/[^\w]/g, ""));

            if(typeof twitch.getStreamerByUsername(tw_canal) == 'undefined') {
                return interaction.reply({ content: '❌ Hooman, ese streamer no se encuentra en mi base de datos...', ephemeral: true });
            }

            twitch.deleteTwitchAccount(tw_canal);

            return interaction.reply({ content: '🙆🏻‍♀️ He eliminado al streamer en mi base de datos hooman...', ephemeral: true });
        } catch(error) {
            console.error('[interaction:slashcmd:twitch:del]', error.message);
        }
    }
};