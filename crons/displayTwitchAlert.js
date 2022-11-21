// Load required resources =================================================================================================
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const cron = require('cron');

// Load configuration files ================================================================================================
const { timezoneSv } = require(path.resolve('./config/bot.json'));
const { tagAlert } = require(path.resolve('./config/twitch.json'));

// Load custom functions ===================================================================================================
const twitch = require(path.resolve('./functions/twitch'));

// Module script ===========================================================================================================
const script = (client) => new cron.CronJob(
    '*/15 * * * * *',
    async function() {
        try {
            const twAccounts = twitch.getStreamers();

            const twToken = (await twitch.getAuth()).access_token;

            twAccounts.forEach(async (account) => {
                // recuperar info de la cuenta
                const userInfo = await twitch.getUserInfoById(twToken, account.twitch_account_id);

                // actualizar el nombre en la base de datos
                twitch.updateTwitchName(userInfo.id, userInfo.login);

                // recuperar datos del stream
                const streamInfo = await twitch.getStreamInfo(twToken, account.twitch_account_id);

                if(typeof streamInfo != 'undefined') { // stream ON
                    client.channels.fetch(account.discord_channel_id).then((channel) => {
                        if(twitch.getCurrentStream(streamInfo.user_id, streamInfo.id) == 0) {
                            alert_tag = '';
                            if(tagAlert.length > 0) {
                                if(tagAlert == 'everyone') {
                                    alert_tag = '@everyone';
                                } else {
                                    alert_tag = `<@&${tagAlert}>`;
                                }
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
                            twitch.registerCurrentStream(streamInfo.user_id, streamInfo.id);
                        }
                    });
                }
            });
        } catch(error) {
            console.error('cronjob:twitchMonitor', error);
        };
    }, null, false, timezoneSv);


// Module export ===========================================================================================================
module.exports = script;