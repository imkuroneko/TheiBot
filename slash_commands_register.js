const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config/bot.json');
const guildsList = require('./config/guilds.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands_slash').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands_slash/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

for(guild of guildsList) {
    rest.put(Routes.applicationGuildCommands(clientId, guild), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}
