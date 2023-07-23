// Load required resources =================================================================================================
const SQLite = require('better-sqlite3');
const axios = require('axios');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const path = require('path');

// Load configuration files ================================================================================================
const { timezoneSv } = require(path.resolve('./config/bot'));
const { clientId, clientSecret } = require(path.resolve('./config/twitch'));

// Load database ===========================================================================================================
const sql = new SQLite(path.resolve('./data/db/twitch.sqlite'));

// Module script ===========================================================================================================
module.exports = {
    /* ===== twitch api ===== */
    getAuth: async function() {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = { client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' };
                await axios.post('https://id.twitch.tv/oauth2/token', headers).then((rst) => {
                    resolve(rst.data);
                }).catch((error) => {
                    console.error('[function:twitch:getAuth:axios]', error.message);
                    reject(null);
                });
            } catch(error) {
                console.error('[function:twitch:getAuth]', error.message);
                reject(null);
            }
        });
    },

    getUserInfoByUsername: async function(bearerToken, userName) {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.get('https://api.twitch.tv/helix/users', {
                    headers: { 'Authorization': `Bearer ${bearerToken}`, 'Client-Id': clientId },
                    params: { login: userName }
                }).then((rst) => {
                    resolve(rst.data.data[0]);
                }).catch((error) => {
                    console.error('[function:twitch:getUserInfoByName:axios]', error.message);
                    reject('[function:twitch:getUserInfoByName:axios]',error.message);
                });
            } catch(error) {
                console.error('[function:twitch:getUserInfoByName]', error.message);
                reject('[function:twitch:getUserInfoByName]', error.message);
            }
        });
    },

    getUserInfoById: async function(bearerToken, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.get('https://api.twitch.tv/helix/users', {
                    headers: { 'Authorization': `Bearer ${bearerToken}`, 'Client-Id': clientId },
                    params: { id: userId }
                }).then((rst) => {
                    resolve(rst.data.data[0]);
                }).catch((error) => {
                    console.error('[function:twitch:getUserInfoById:axios]', error.message);
                    reject('[function:twitch:getUserInfoById:axios]',error.message);
                });
            } catch(error) {
                console.error('[function:twitch:getUserInfoById]', error.message);
                reject('[function:twitch:getUserInfoById]', error.message);
            }
        });
    },
    
    getStreamInfo: async function(bearerToken, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.get('https://api.twitch.tv/helix/streams', {
                    headers: { 'Authorization': `Bearer ${bearerToken}`, 'Client-Id': clientId },
                    params: { user_id: userId }
                }).then((rst) => {
                    resolve(rst.data.data[0]);
                }).catch((error) => {
                    console.error('[function:twitch:getStreamInfo:axios]', error.message);
                    reject('[function:twitch:getStreamInfo:axios]',error.message);
                });
            } catch(error) {
                console.error('[function:twitch:getStreamInfo]', error.message);
                reject('[function:twitch:getStreamInfo]', error.message);
            }
        });
    },

    /* ========= bd ========= */
    getStreamerById: function(userId) {
        try {
            const query = sql.prepare(" SELECT * FROM streamers WHERE twitch_account_id = ?; ");
            return query.get(userId);
        } catch(error) {
            console.error('[[sqlite:twitch:getStreamerById]]', error.message);
        }
    },

    getStreamerByUsername: function(userName) {
        try {
            const query = sql.prepare(" SELECT * FROM streamers WHERE twitch_account_name = ?; ");
            return query.get(userName);
        } catch(error) {
            console.error('[[sqlite:twitch:getStreamerByUsername]]', error.message);
        }
    },

    getStreamers: function() {
        try {
            const query = sql.prepare(" SELECT * FROM streamers; ");
            return query.all();
        } catch(error) {
            console.error('[[sqlite:twitch:getStreamers]]', error.message);
        }
    },

    registerTwitchUser: function(twitchId, twitchName, embedColor, discordChannel) {
        try {
            const query = sql.prepare(" INSERT INTO streamers ( twitch_account_id, twitch_account_name, discord_embed_color, discord_channel_id ) VALUES (@tid, @tnm, @dec, @dch); ");
            query.run({
                tid: twitchId,
                tnm: twitchName,
                dec: embedColor,
                dch: discordChannel,
            });
        } catch(error) {
            console.error('[[sqlite:twitch:registerTwitchUser]]', error.message);
        }
    },

    updateTwitchName: function(twitchId, twitchName) {
        try {
            const query = sql.prepare(" UPDATE streamers SET twitch_account_name = @tnm WHERE twitch_account_id = @tid; ");
            query.run({
                tid: twitchId,
                tnm: twitchName
            });
        } catch(error) {
            console.error('[[sqlite:twitch:updateTwitchName]]', error.message);
        }
    },

    deleteTwitchAccount: function(twitchId) {
        try {
            const query = sql.prepare(" DELETE FROM streamers WHERE twitch_account_id = @tid; ");
            query.run({
                tid: twitchId
            });
        } catch(error) {
            console.error('[[sqlite:twitch:deleteTwitchAccount]]', error.message);
        }
    },

    registerCurrentStream: function(streamerId, streamId) {
        try {
            dayjs.extend(timezone);
            dayjs.tz.setDefault(timezoneSv);
    
            const query = sql.prepare(" INSERT INTO stream_tracker ( twitch_account_id, stream_id, last_update ) VALUES ( @tid, @sid, @lup ) ON CONFLICT (twitch_account_id) DO UPDATE SET stream_id = @sid, last_update = @lup; ");
            query.run({
                tid: streamerId,
                sid: streamId,
                lup: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            });
        } catch(error) {
            console.error('[sqlite:twitch:registerCurrentStream]', error.message);
        }
    },

    getCurrentStream: function(streamerId, streamId) {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM stream_tracker WHERE twitch_account_id = ? AND stream_id = ?; ");
            return query.get(streamerId, streamId).count;
        } catch(error) {
            console.error('[sqlite:twitch:getCurrentStream]', error.message);
        }
    },

};
