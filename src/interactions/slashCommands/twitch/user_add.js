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
        .addStringOption(option => option.setName('CanalDeTwitch').setDescription('El usuario de Twitch').setRequired(true).setMinLength(1).setMaxLength(25))
        .addChannelOption(option => option.setName('CanalDeDiscord').setDescription('Canal para los anuncios').setRequired(true).addChannelTypes(ChannelType.GuildText).addChannelTypes(ChannelType.GuildAnnouncement))
        .addStringOption(option => option.setName('ColorHex').setDescription('Color en hexadecimal para el embed').setRequired(true).setMinLength(6).setMaxLength(6))
        .addRoleOption(option => option.setName('RolDeMenciones').setDescription('Rol para mencionar en los anuncios').setRequired(false))
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const tw_canal = (interaction.options.getString('CanalDeTwitch').replace(/[^\w]/g, ""));
            const ds_canal = (interaction.options.getChannel('CanalDeDiscord').id.replace(/[^\w]/g, ""));
            const rol_menciones = (interaction.options.getRole('RolDeMenciones') ? interaction.options.getRole('RolDeMenciones').id : null);
            const color_hex = (interaction.options.getString('ColorHex').replace(/[^\w]/g, ""));

            if (!helper.validateHexColor(color_hex)) {
                return interaction.reply({ content: '❌ Hooman, eso no es un color válido...', ephemeral: true });
            }

            const authData = await getAuth();
            if (!authData) { return interaction.reply({ content: '❌ No se pudo obtener el token de Twitch.', ephemeral: true }); }

            const twitchData = await getUserInfoByUsername(authData.access_token, tw_canal);

            if (typeof twitchData == 'undefined') {
                return interaction.reply({ content: '❌ Hooman, no existe ese usuario en Twitch...', ephemeral: true });
            }

            if (await Streamer.findOne({ where: { twitch_account_id: twitchData.id } }) !== null) {
                return interaction.reply({ content: '❌ Hooman, ya está registrado ese streamer en mi base de datos...', ephemeral: true });
            }

            await Streamer.create({
                twitch_account_id: twitchData.id,
                twitch_account_name: twitchData.login,
                discord_embed_color: color_hex,
                discord_channel_id: ds_canal,
                discord_mention_role_id: rol_menciones
            });

            return interaction.reply({ content: '🙆🏻‍♀️ He registrado al streamer en mi base de datos hooman...', ephemeral: true });
        } catch (error) {
            console.error('[interaction:slashcmd:twitch:add]', error.message);
        }
    }
};