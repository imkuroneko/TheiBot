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
        .setName('bot')
        .setDescription('Ver detalles del bot y su servidor.')
        .setDMPermission(false),
    async execute(interaction) {
        try {
            cpuStat.usagePercent(function (e, percent, seconds) {
                const djsversion = require('discord.js').version;
                const ping = interaction.client.ws.ping;
                return interaction.reply({ embeds: [{
                    color: 0x62d1f0,
                    title: '💻 Información del servidor del bot',
                    description:
                    "```"+
                    `🟢 NodeJS        ${process.version}\n`+
                    `🟣 DiscordJS     v${djsversion}\n`+
                    `⌚ API Latency   ${ping}ms\n\n`+

                    `⌚ Uptime        ${helpers.duration(interaction.client.uptime)}\n`+
                    `💻 S.O.          ${os.platform()} (${os.arch()})\n`+
                    `🧮 Consumo RAM   ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}Mb / ${(os.totalmem() / 1024 / 1024).toFixed(2)}Mb \n`+
                    `🤖 Consumo CPU   ${percent.toFixed(2)}%\n`+
                    "```",
                }] });
            });
        } catch(error) {
            console.error('[interaction:slashcmd:host]', error.message);
        }
    }
};