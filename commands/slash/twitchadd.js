// Load required resources =================================================================================================
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const path = require('path');

// Load custom functions ===================================================================================================
const helper = require(path.resolve('./functions/utilitarios'));
const twitch = require(path.resolve('./functions/twitch'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('twitchadd')
        .setDescription('Registrar canal de Twitch')
        .addStringOption(option => option.setName('tw_canal').setDescription('Canal de twitch').setRequired(true).setMinLength(1).setMaxLength(25))
        .addChannelOption(option => option.setName('ds_canal').setDescription('Canal de discord para los anuncios').setRequired(true).addChannelTypes(ChannelType.GuildText).addChannelTypes(ChannelType.GuildAnnouncement))
        .addStringOption(option => option.setName('color_hex').setDescription('Color en hexadecimal para el embed').setRequired(true).setMinLength(6).setMaxLength(6))
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const tw_canal  = (interaction.options.getString('tw_canal').replace(/[^\w]/g, ""));
            const ds_canal  = (interaction.options.getChannel('ds_canal').id.replace(/[^\w]/g, ""));
            const color_hex = (interaction.options.getString('color_hex').replace(/[^\w]/g, ""));

            if(!helper.validateHexColor(color_hex)) {
                return interaction.reply({ content: '❌ Hooman, eso no es un color válido...', ephemeral: true });
            }

            const twToken = (await twitch.getAuth()).access_token;

            const twitchData = await twitch.getUserInfoByUsername(twToken, tw_canal);

            if(typeof twitchData == 'undefined') {
                return interaction.reply({ content: '❌ Hooman, no existe ese usuario en Twitch...', ephemeral: true });
            }

            if(typeof twitch.getStreamerById(twitchData.id) != 'undefined') {
                return interaction.reply({ content: '❌ Hooman, ya está registrado ese streamer en mi base de datos...', ephemeral: true });
            }

            twitch.registerTwitchUser(twitchData.id, twitchData.login, color_hex, ds_canal);

            return interaction.reply({ content: '🙆🏻‍♀️ He registrado al streamer en mi base de datos hooman...', ephemeral: true });
        } catch(error) {
            console.error('cmdSlash:twitchAdd |', error.message);
        }
    }
};