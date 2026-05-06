// Load required resources =================================================================================================
const axios  = require('axios');
const { XMLParser } = require('fast-xml-parser');

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '_' });

// Headers genéricos para evitar bloqueos 429 en scraping ligero
const HEADERS = { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'Mozilla/5.0' };

// YouTube RSS / Scraping ==================================================================================================

// Obtener info del canal (id, nombre, avatar) scrapeando la página del handle
const getChannelInfo = async function(handle) {
    const h = handle.startsWith('@') ? handle : `@${handle}`;
    try {
        const res  = await axios.get(`https://www.youtube.com/${h}`, { headers: HEADERS });
        const html = res.data;

        const idMatch     = html.match(/"externalId":"(UC[^"]+)"/);
        const nameMatch   = html.match(/<meta property="og:title" content="([^"]+)"/);
        const avatarMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

        if (!idMatch) { return undefined; }

        return {
            id:     idMatch[1],
            name:   nameMatch?.[1]  ?? handle,
            avatar: avatarMatch?.[1] ?? null,
        };
    } catch(error) {
        console.error('[service:youtube:getChannelInfo]', error.message);
        return undefined;
    }
};

// Obtener entradas del feed RSS de un canal
const getChannelFeed = async function(channelId) {
    try {
        const res  = await axios.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { headers: HEADERS });
        const data = xmlParser.parse(res.data);
        const entries = data?.feed?.entry;
        if (!entries) { return []; }

        const list = Array.isArray(entries) ? entries : [entries];
        return list.map(e => {
            // El feed ya indica si es Short en el href del link alternate
            const links = e.link;
            const href  = (Array.isArray(links) ? links.find(l => l._rel === 'alternate') : links)?._href ?? '';
            const short = href.includes('/shorts/');
            const url   = href || `https://www.youtube.com/${short ? 'shorts/' : 'watch?v='}${e['yt:videoId']}`;

            return {
                videoId:     e['yt:videoId'],
                title:       e.title,
                publishedAt: e.published,
                thumbnail:   e['media:group']?.['media:thumbnail']?._url ?? null,
                isShort:     short,
                url,
            };
        });
    } catch(error) {
        console.error('[service:youtube:getChannelFeed]', error.message);
        return [];
    }
};

// Exports =================================================================================================================
module.exports = { getChannelInfo, getChannelFeed };
