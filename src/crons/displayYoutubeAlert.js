// Load required resources =================================================================================================
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const cron = require('cron');

// Load configuration files ================================================================================================
const { timezoneSv } = require(path.resolve('./config/bot'));

// Load custom functions ===================================================================================================
const { getChannelFeed } = require(path.resolve('./src/services/youtube'));
const { YoutubeChannel, YoutubeTracker } = require(path.resolve('./src/database/models'));

// Colores fijos para los embeds
// Celestito para videos normales / verdecito lima softy para Shorts
const COLOR_VIDEO = 0x87CEEB;
const COLOR_SHORT = 0xAAFF66;

// Module script ===========================================================================================================
// Se ejecuta cada 15 minutos — el feed RSS es gratuito y sin cuota
const script = (client) => new cron.CronJob(
    '0 */15 * * * *',
    async function() {
        try {
            const channels = await YoutubeChannel.findAll();
            if (!channels.length) { return; }

            for (const account of channels) {
                try {
                    const entries = await getChannelFeed(account.youtube_channel_id);

                    for (const entry of entries) {
                        const { videoId, title, publishedAt, thumbnail, isShort, url: videoUrl } = entry;
                        if (!videoId) { continue; }

                        // Verificar si ya fue anunciado
                        const already = await YoutubeTracker.count({ where: { video_id: videoId } });
                        if (already > 0) { continue; }

                        const short = isShort;

                        const discordChannel = await client.channels.fetch(account.discord_channel_id);

                        let alert_tag = '';
                        if (account.discord_mention_role_id) {
                            alert_tag = `<@&${account.discord_mention_role_id}>`;
                        }

                        await discordChannel.send({
                            content: alert_tag,
                            embeds: [{
                                color:       short ? COLOR_SHORT : COLOR_VIDEO,
                                author: {
                                    name:    account.youtube_channel_name,
                                    icon_url: account.youtube_channel_avatar ?? undefined,
                                    url:     `https://www.youtube.com/@${account.youtube_channel_handle}`,
                                },
                                title,
                                description: short ? '🎬 Nuevo Short publicado' : '🎥 Nuevo video publicado',
                                url:         videoUrl, // clickeable en el título del embed
                                image:       thumbnail ? { url: thumbnail } : undefined,
                                timestamp:   publishedAt,
                            }],
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setURL(videoUrl)
                                        .setLabel(short ? 'Ver Short' : 'Ver Video')
                                        .setStyle(ButtonStyle.Link),
                                )
                            ]
                        });

                        // Registrar el video para no repetir el anuncio
                        await YoutubeTracker.create({
                            video_id:           videoId,
                            youtube_channel_id: account.youtube_channel_id,
                            published_at:       publishedAt,
                        });
                    }
                } catch(accountError) {
                    console.error('[cron:youtubeMonitor:account]', accountError.message);
                }
            }
        } catch(error) {
            console.error('[cron:youtubeMonitor]', error.message);
        }
    }, null, false, timezoneSv);

// Module export ===========================================================================================================
module.exports = script;