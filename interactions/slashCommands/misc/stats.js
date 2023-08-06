// Load required resources =================================================================================================
const { SlashCommandBuilder } = require('discord.js');
const cpuStat = require('cpu-stat');
const path = require('path');
const os = require('os');

// Load custom functions ===================================================================================================
const helpers = require(path.resolve('./functions/helpers.js'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Ver detalles del bot y el servidor.')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            cpuStat.usagePercent(function (e, percent, seconds) {
                const djsversion = require('discord.js').version;
                const ping = interaction.client.ws.ping;
                return interaction.reply({
                    embeds: [
                        {
                            color: 0x62d1f0,
                            title: '💻 Información del servidor',
                            fields: [
                                { inline: false, name: '💻 S.O.', value: "```"+os.platform()+" ("+os.arch()+")```" },
                                { inline: true, name: '⌚ Uptime', value: "```"+helpers.duration(os.uptime())+"```" },
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
                                { inline: true, name: '⌚ Uptime', value: "```"+helpers.duration(interaction.client.uptime)+"```" },
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