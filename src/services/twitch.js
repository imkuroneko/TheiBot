// Load required resources =================================================================================================
const axios = require('axios');
const path = require('path');

// Load configuration files ================================================================================================
const { clientId, clientSecret } = require(path.resolve('./config/twitch'));

// Load models =============================================================================================================
const { TokenCache } = require(path.resolve('./src/database/models'));

// Twitch API ==============================================================================================================
const getAuth = async function() {
    const now = Date.now();

    // 1. BD: puede haber un token válido de una sesión anterior o del mismo proceso
    try {
        const stored = await TokenCache.findOne({ where: { id: 1 } });
        if(stored && now < Number(stored.expires_at) - 300_000) {
            return { access_token: stored.access_token };
        }
    } catch(error) {
        console.error('[service:twitch:getAuth:db:read]', error.message);
    }

    // 2. API: generar nuevo token y persistirlo
    try {
        const headers = { client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' };
        const rst = await axios.post('https://id.twitch.tv/oauth2/token', headers);
        const expiresAt = now + (rst.data.expires_in * 1000);

        await TokenCache.upsert({ id: 1, access_token: rst.data.access_token, expires_at: expiresAt });

        return { access_token: rst.data.access_token };
    } catch(error) {
        console.error('[service:twitch:getAuth]', error.message);
        return null;
    }
};

const getUserInfoByUsername = async function(bearerToken, userName) {
    try {
        const rst = await axios.get('https://api.twitch.tv/helix/users', {
            headers: { 'Authorization': `Bearer ${bearerToken}`, 'Client-Id': clientId },
            params: { login: userName }
        });
        return rst.data.data[0];
    } catch(error) {
        console.error('[service:twitch:getUserInfoByUsername]', error.message);
        return undefined;
    }
};

const getUserInfoById = async function(bearerToken, userId) {
    try {
        const rst = await axios.get('https://api.twitch.tv/helix/users', {
            headers: { 'Authorization': `Bearer ${bearerToken}`, 'Client-Id': clientId },
            params: { id: userId }
        });
        return rst.data.data[0];
    } catch(error) {
        console.error('[service:twitch:getUserInfoById]', error.message);
        return undefined;
    }
};

const getStreamInfo = async function(bearerToken, userId) {
    try {
        const rst = await axios.get('https://api.twitch.tv/helix/streams', {
            headers: { 'Authorization': `Bearer ${bearerToken}`, 'Client-Id': clientId },
            params: { user_id: userId }
        });
        return rst.data.data[0];
    } catch(error) {
        console.error('[service:twitch:getStreamInfo]', error.message);
        return undefined;
    }
};

// Exports =================================================================================================================
module.exports = { getAuth, getUserInfoByUsername, getUserInfoById, getStreamInfo };
