// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');
const cpuStat = require('cpu-stat');
const path = require('path');
const si = require('systeminformation');
const os = require('os');

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Ver detalles del bot y el servidor.')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            cpuStat.usagePercent(async function(e, percent, seconds) {
                const djsversion = require('discord.js').version;
                const ping = interaction.client.ws.ping;
                const uptimeData = si.time();

                return interaction.reply({
                    embeds: [
                        {
                            color: 0x62d1f0,
                            title: '💻 Información del servidor',
                            fields: [
                                { inline: false, name: '💻 S.O.', value: "```"+os.platform()+" ("+os.arch()+")```" },
                                { inline: true, name: '⌚ Uptime', value: "```"+formatUptime(uptimeData.uptime)+"```" },
                                { inline: true, name: '🧮 Memoria', value: "```"+((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)+" de "+(os.totalmem() / 1024 / 1024).toFixed(2)+"Mb```" },
                                { inline: true, name: '🤖 CPU', value: "```"+percent.toFixed(2)+"%```" },
                            ]
                        },
                        {
                            color: 0xd45978,
                            title: '🤖 Información del bot y entorno',
                            fields: [
                                { inline: true, name: '🟢 NodeJS', value: "```"+process.version+"```" },
                                { inline: true, name: '🟣 DiscordJS', value: "```v"+djsversion+"```" },
                                { inline: true, name: '📶 Latencia API', value: "```"+ping+"ms```" },
                                { inline: true, name: '⌚ Uptime', value: "```"+formatUptime(interaction.client.uptime)+"```" },
                                { inline: true, name: '🧮 Memoria', value: "```"+((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)+" de "+(os.totalmem() / 1024 / 1024).toFixed(2)+"Mb```" },
                            ]
                        },
                    ]
                });
            });
        } catch(error) {
            console.error('[interaction:slashcmd:stats]', error.message);
        }
    }
};

function formatUptime(uptimeInSeconds) {
    const days = Math.floor(uptimeInSeconds / 86400);
    const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    const formattedUptime = [];
    if(days > 0) { formattedUptime.push(`${days}d`); }
    if(hours > 0) { formattedUptime.push(`${hours}h`); }
    if(minutes > 0) { formattedUptime.push(`${minutes}m`); }
    if(seconds > 0) { formattedUptime.push(`${seconds}s`); }

    return formattedUptime.join(' ');
}