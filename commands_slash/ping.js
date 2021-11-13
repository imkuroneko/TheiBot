const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nuggots')
		.setDescription('Just... nuggots'),
	async execute(interaction) {
		return interaction.reply('🍗🍗🍗');
	}
};