const { token } = require('../config/bot.json');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const cpuStat = require("cpu-stat");
const os = require("os");

const fg = Intents.FLAGS;
const client2 = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents: [
        fg.GUILDS, fg.GUILD_INTEGRATIONS, fg.GUILD_WEBHOOKS,
        fg.GUILD_PRESENCES, fg.GUILD_VOICE_STATES,
        fg.GUILD_INVITES, fg.GUILD_MEMBERS, fg.GUILD_BANS,
        fg.GUILD_MESSAGES, fg.GUILD_MESSAGE_REACTIONS, fg.GUILD_MESSAGE_TYPING
    ]
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
				const botinfo = new MessageEmbed()
					.setTitle("💻 Información del bot y estado del servidor")
					.setColor(0x62d1f0)
					.addField("🤖 NodeJS", "```"+process.version+"```")
					.addField("👾 Discord.JS", "```v"+Discord.version+"```")
					.addField("🏸 API Latency", "```"+client2.ws.ping+"ms```")
					.addField("⌚️ Uptime ", "```"+duration(client2.uptime).map(i=>i).join(", ")+"```")
					.addField("🧮 Consumo Memoria", "```"+(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)+" de "+(os.totalmem() / 1024 / 1024).toFixed(2)+"Mb```")
					.addField("🤖 Consumo CPU", "```"+percent.toFixed(2)+"%```")
					.addField("💻 Sistema Operativo", "```"+os.platform()+" ("+os.arch()+")```")
					.setFooter("by KuroNeko", "https://cdn.discordapp.com/emojis/741619183514812425.png");
				interaction.reply({ embeds: [botinfo] });
			} catch (e) {
				console.log(e);
				const botinfo = new MessageEmbed()
					.setTitle("💻 Información del bot y estado del servidor")
					.setColor(0x62d1f0)
					.addField("🤖 NodeJS", "```"+process.version+"```")
					.addField("👾 Discord.JS", "```v"+Discord.version+"```")
					.addField("🏸 API Latency", "```"+client2.ws.ping+"ms```")
					.addField("⌚️ Uptime ", "```"+duration(client2.uptime).map(i=>i).join(", ")+"```")
					.addField("🧮 Consumo Memoria", "```"+(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)+" de "+(os.totalmem() / 1024 / 1024).toFixed(2)+"Mb```")
					.addField("🤖 Consumo CPU", "```"+percent.toFixed(2)+"%```")
					.addField("💻 Sistema Operativo", "```"+os.platform()+" ("+os.arch()+")```")
					.setFooter("by KuroNeko", "https://cdn.discordapp.com/emojis/741619183514812425.png");
				interaction.reply({ embeds: [botinfo] });
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