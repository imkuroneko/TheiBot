// Load required resources =================================================================================================
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const cron = require('cron');

// Load configuration files ================================================================================================
const { timezoneSv } = require(path.resolve('./config/bot'));

// Load custom functions ===================================================================================================
const { getAuth, getUserInfoById, getStreamInfo } = require(path.resolve('./src/services/twitch'));
const { Streamer, StreamTracker } = require(path.resolve('./src/database/models'));
const dayjs = require('dayjs');

// Module script ===========================================================================================================
const script = (client) => new cron.CronJob(
    '*/15 * * * * *',
    async function() {
        try {
            const twAccounts = await Streamer.findAll();

            const authData = await getAuth();
            if(!authData) { return; }
            const twToken = authData.access_token;

            for(const account of twAccounts) {
                try {
                    // recuperar info de la cuenta
                    const userInfo = await getUserInfoById(twToken, account.twitch_account_id);

                    // actualizar el nombre en la base de datos
                    await Streamer.update({ twitch_account_name: userInfo.login }, { where: { twitch_account_id: userInfo.id } });

                    // recuperar datos del stream
                    const streamInfo = await getStreamInfo(twToken, account.twitch_account_id);

                    if(streamInfo != null) { // stream ON
                        const channel = await client.channels.fetch(account.discord_channel_id);
                        const streamCount = await StreamTracker.count({ where: { twitch_account_id: streamInfo.user_id, stream_id: streamInfo.id } });

                        if(streamCount == 0) {
                            let alert_tag = '';
                            if(account.discord_mention_role_id) {
                                alert_tag = `<@&${account.discord_mention_role_id}>`;
                            }

                            // enviar el embed
                            channel.send({
                                content: alert_tag,
                                embeds: [ {
                                    color: parseInt(account.discord_embed_color, 16),
                                    author: {
                                        name: streamInfo.user_name,
                                        icon_url: userInfo.profile_image_url,
                                        url: `https://twitch.tv/${streamInfo.user_login}`,
                                    },
                                    description: `**Categoría:** ${streamInfo.game_name}`,
                                    title: `**${streamInfo.title}**`,
                                    image: { url: (streamInfo.thumbnail_url.replace('{width}x{height}', '1920x1080')) },
                                } ],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder().setURL(`https://twitch.tv/${streamInfo.user_login}`).setLabel('🎥 Ir a Twitch').setStyle(ButtonStyle.Link),
                                    )
                                ]
                            });

                            // registrar este stream para evitar spam
                            await StreamTracker.upsert({ twitch_account_id: streamInfo.user_id, stream_id: streamInfo.id, last_update: dayjs().format('YYYY-MM-DD HH:mm:ss') });
                        }
                    }
                } catch(accountError) {
                    console.error('cronjob:twitchMonitor:account', accountError.message);
                }
            }
        } catch(error) {
            console.error('cronjob:twitchMonitor', error);
        };
    }, null, false, timezoneSv);


// Module export ===========================================================================================================
module.exports = script;