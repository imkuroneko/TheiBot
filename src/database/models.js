// Load required resources =================================================================================================
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Database connection =====================================================================================================
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve('./data/db/twitch.sqlite'),
    logging: false,
});

// Models ==================================================================================================================
const Streamer = sequelize.define('streamers', {
    twitch_account_id:   { type: DataTypes.STRING, primaryKey: true },
    twitch_account_name: { type: DataTypes.STRING },
    discord_embed_color: { type: DataTypes.STRING },
    discord_channel_id:  { type: DataTypes.STRING },
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

sequelize.sync().catch(error => console.error('[db:sync]', error.message));

// Exports =================================================================================================================
module.exports = { sequelize, Streamer, StreamTracker, TokenCache };
