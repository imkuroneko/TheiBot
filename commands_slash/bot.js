const { token } = require('../config/bot.json');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents } = require("discord.js");
const Discord = require("discord.js");
const cpuStat = require("cpu-stat");
const os = require("os");

const client2 = new Client({
    partials: [ 'MESSAGE' ],
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING ]
});
client2.login(token);
client2.once('ready', () => {
    console.log('Shard resources listo!');
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Ver información del bot.'),
	async execute(interaction) {

		cpuStat.usagePercent(function (e, percent, seconds) {
			try {
				if(e) { return console.log(e.stack); }
                return interaction.reply({ embeds: [{
                    color: 0x62d1f0,
                    title: '💻 Información del bot y estado del servidor',
                    fields: [
                        { name: '🤖 NodeJS', value: "```"+process.version+"```" },
                        { name: '👾 Discord.JS', value: "```v"+Discord.version+"```" },
                        { name: '🏸 API Latency', value: "```"+client2.ws.ping+"ms```" },
                        { name: '⌚️ Uptime', value: "```"+duration(client2.uptime).map(i=>i).join(", ")+"```" },
                        { name: '🧮 Consumo Memoria', value: "```"+(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)+" de "+(os.totalmem() / 1024 / 1024).toFixed(2)+"Mb```" },
                        { name: '🤖 Consumo CPU', value: "```"+percent.toFixed(2)+"%```" },
                        { name: '💻 Sistema Operativo', value: "```"+os.platform()+" ("+os.arch()+")```" },
                    ],
                    thumbnail: { url: 'https://cdn.discordapp.com/emojis/741619183514812425.png', text: 'by KuroNeko' }
                }] });
			} catch (e) {
				console.log(e);
                return interaction.reply({ embeds: [{
                    color: 0x62d1f0,
                    title: '💻 Información del bot y estado del servidor',
                    fields: [
                        { name: '🤖 NodeJS', value: "```"+process.version+"```" },
                        { name: '👾 Discord.JS', value: "```v"+Discord.version+"```" },
                        { name: '🏸 API Latency', value: "```"+client2.ws.ping+"ms```" },
                        { name: '⌚️ Uptime', value: "```"+duration(client2.uptime).map(i=>i).join(", ")+"```" },
                        { name: '🧮 Consumo Memoria', value: "```"+(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)+" de "+(os.totalmem() / 1024 / 1024).toFixed(2)+"Mb```" },
                        { name: '🤖 Consumo CPU', value: "```"+percent.toFixed(2)+"%```" },
                        { name: '💻 Sistema Operativo', value: "```"+os.platform()+" ("+os.arch()+")```" },
                    ],
                    thumbnail: { url: 'https://cdn.discordapp.com/emojis/741619183514812425.png', text: 'by KuroNeko' }
                }] });
			}
		});

		function duration(duration, useMilli = false) {
			let remain = duration;
			let days = Math.floor(remain / (1000 * 60 * 60 * 24));
			remain = remain % (1000 * 60 * 60 * 24);
			let hours = Math.floor(remain / (1000 * 60 * 60));
			remain = remain % (1000 * 60 * 60);
			let minutes = Math.floor(remain / (1000 * 60));
			remain = remain % (1000 * 60);
			let seconds = Math.floor(remain / (1000));
			remain = remain % (1000);
			let milliseconds = remain;
			let time = { days, hours, minutes, seconds, milliseconds };
			let parts = []

			if(time.days) {
				parts.push(time.days + ' Día'+(time.days !== 1 ? 's' : ''));
			}
			if(time.hours) {
				parts.push(time.hours + ' H'+(time.hours !== 1 ? 's' : ''));
			}
			if(time.minutes) {
				parts.push(time.minutes + ' Min'+(time.minutes !== 1 ? 's' : ''));

			}
			if(time.seconds) {
				parts.push(time.seconds + ' Seg'+(time.seconds !== 1 ? 's' : ''));
			}
			if(useMilli && time.milliseconds) {
				parts.push(time.milliseconds + ' ms');
			}

			if(parts.length === 0) {
				return ['instantly']
			} else {
				return parts
			}
		}
	}
};