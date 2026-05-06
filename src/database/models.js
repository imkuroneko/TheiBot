// Load required resources =================================================================================================
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Database connection =====================================================================================================
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve('./data/db/database.sqlite'),
    logging: false,
});

// Models ==================================================================================================================
const Streamer = sequelize.define('streamers', {
    twitch_account_id:        { type: DataTypes.STRING, primaryKey: true },
    twitch_account_name:      { type: DataTypes.STRING },
    discord_embed_color:      { type: DataTypes.STRING },
    discord_channel_id:       { type: DataTypes.STRING },
    discord_mention_role_id:  { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, { timestamps: false, freezeTableName: true });

const StreamTracker = sequelize.define('stream_tracker', {
    twitch_account_id: { type: DataTypes.STRING, primaryKey: true },
    stream_id:         { type: DataTypes.STRING },
    last_update:       { type: DataTypes.STRING },
}, { timestamps: false, freezeTableName: true });

const TokenCache = sequelize.define('token_cache', {
    id:           { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
    access_token: { type: DataTypes.STRING },
    expires_at:   { type: DataTypes.BIGINT },
}, { timestamps: false, freezeTableName: true });

const GuildMemberLog = sequelize.define('guild_member_log', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    guild_id:    { type: DataTypes.STRING, allowNull: false },
    user_id:     { type: DataTypes.STRING, allowNull: false },
    username:    { type: DataTypes.STRING, allowNull: false },
    joined_at:   { type: DataTypes.BIGINT, allowNull: false },
    left_at:     { type: DataTypes.BIGINT, allowNull: true, defaultValue: null },
}, { timestamps: false, freezeTableName: true });

const LogSetting = sequelize.define('log_settings', {
    setting_name:        { type: DataTypes.STRING, primaryKey: true },
    setting_description: { type: DataTypes.STRING },
    setting_enabled:     { type: DataTypes.BOOLEAN, defaultValue: false },
    setting_channel:     { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, { timestamps: false, freezeTableName: true });

const BotActivity = sequelize.define('bot_activities', {
    id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type:    { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false, freezeTableName: true });

const YoutubeChannel = sequelize.define('youtube_channels', {
    youtube_channel_id:      { type: DataTypes.STRING, primaryKey: true },
    youtube_channel_handle:  { type: DataTypes.STRING },
    youtube_channel_name:    { type: DataTypes.STRING },
    youtube_channel_avatar:  { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    discord_channel_id:      { type: DataTypes.STRING },
    discord_mention_role_id: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, { timestamps: false, freezeTableName: true });

const YoutubeTracker = sequelize.define('youtube_tracker', {
    video_id:           { type: DataTypes.STRING, primaryKey: true },
    youtube_channel_id: { type: DataTypes.STRING },
    published_at:       { type: DataTypes.STRING },
}, { timestamps: false, freezeTableName: true });

// Seed ====================================================================================================================
const LOG_SETTINGS_SEED = [
    { setting_name: 'log_user_entrance',   setting_description: 'Log de entrada de miembros' },
    { setting_name: 'log_user_exit',       setting_description: 'Log de salida de miembros'  },
    { setting_name: 'log_messages_send',   setting_description: 'Log de mensajes enviados'   },
    { setting_name: 'log_messages_edit',   setting_description: 'Log de mensajes editados'   },
    { setting_name: 'log_messages_delete', setting_description: 'Log de mensajes eliminados' },
    { setting_name: 'welcome_channel',     setting_description: 'Canal de bienvenida'        },
    { setting_name: 'voice_presence',      setting_description: 'Canal de voz del bot'       },
];

async function seedLogSettings() {
    for (const entry of LOG_SETTINGS_SEED) {
        await LogSetting.findOrCreate({ where: { setting_name: entry.setting_name }, defaults: entry });
    }
}

sequelize.sync({ alter: true }).then(() => seedLogSettings()).catch(error => console.error('[db:sync]', error.message));

// Exports =================================================================================================================
module.exports = {
    sequelize,
    Streamer,
    StreamTracker,
    TokenCache,
    GuildMemberLog,
    LogSetting, LOG_SETTINGS_SEED,
    BotActivity,
    YoutubeChannel,
    YoutubeTracker,
};