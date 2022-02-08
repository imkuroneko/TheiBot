const { clientId, token } = require('../config/bot.json');

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
    name: 'guildCreate',
    async execute(guild) {

        const commands = [];
        const commandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));
        for(const file of commandFiles) {
            const command = require(`../commands/slash/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '9' }).setToken(token);
        rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands })
            .then(() => console.log('Los comandos slash se han registrado exitosamente ^^,'))
            .catch(console.error);
    }
};