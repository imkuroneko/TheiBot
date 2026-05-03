// Load required resources =================================================================================================
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const path = require('path');

// Load models =============================================================================================================
const { Streamer } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('twitchdel')
        .setDescription('Eliminar un canal de Twitch')
        .addStringOption(option => option.setName('CanalDeTwitch').setDescription('El usuario de Twitch').setRequired(true).setMinLength(1).setMaxLength(25))
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const tw_canal = (interaction.options.getString('CanalDeTwitch').replace(/[^\w]/g, ""));

            if(await Streamer.findOne({ where: { twitch_account_name: tw_canal } }) === null) {
                return interaction.reply({ content: '❌ Hooman, ese streamer no se encuentra en mi base de datos...', ephemeral: true });
            }

            await Streamer.destroy({ where: { twitch_account_name: tw_canal } });

            return interaction.reply({ content: '🙆🏻‍♀️ He eliminado al streamer en mi base de datos hooman...', ephemeral: true });
        } catch(error) {
            console.error('[interaction:slashcmd:twitch:del]', error.message);
        }
    }
};