// Load required resources =================================================================================================
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const path = require('path');

// Load custom functions ===================================================================================================
const helper = require(path.resolve('./src/functions/helpers'));
const { getAuth, getUserInfoByUsername } = require(path.resolve('./src/services/twitch'));
const { Streamer } = require(path.resolve('./src/database/models'));

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

            const authData = await getAuth();
            if(!authData) { return interaction.reply({ content: '❌ No se pudo obtener el token de Twitch.', ephemeral: true }); }

            const twitchData = await getUserInfoByUsername(authData.access_token, tw_canal);

            if(typeof twitchData == 'undefined') {
                return interaction.reply({ content: '❌ Hooman, no existe ese usuario en Twitch...', ephemeral: true });
            }

            if(await Streamer.findOne({ where: { twitch_account_id: twitchData.id } }) !== null) {
                return interaction.reply({ content: '❌ Hooman, ya está registrado ese streamer en mi base de datos...', ephemeral: true });
            }

            await Streamer.create({ twitch_account_id: twitchData.id, twitch_account_name: twitchData.login, discord_embed_color: color_hex, discord_channel_id: ds_canal });

            return interaction.reply({ content: '🙆🏻‍♀️ He registrado al streamer en mi base de datos hooman...', ephemeral: true });
        } catch(error) {
            console.error('[interaction:slashcmd:twitch:add]', error.message);
        }
    }
};