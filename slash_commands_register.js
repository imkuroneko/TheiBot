const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config/bot.json');
const Discord = require("discord.js");
const { exit } = require('process');
const client = new Discord.Client({
    intents: ["GUILDS"],
});

client.on("ready", () => {

    // Preparar comandos a manipular ===================================================================
    const commands = [];
    const commandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));
    
    for(const file of commandFiles) {
        const command = require(`./commands/slash/${file}`);
        commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: '9' }).setToken(token);

    // Obtener lista de guilds e interactuar con esta ==================================================
    const Guilds = client.guilds.cache.map(guild => guild.id);
    for(let index = 0; index < Guilds.length; index++) {
        rest.put(Routes.applicationGuildCommands(clientId, Guilds[index]), { body: commands })
            .then(() => console.log(`✔ Registrado comandos en guild: ${Guilds[index]}.`))
            .catch(console.log(`✖ Error al registrar en guild:  ${Guilds[index]}.`));
    }

    process.exit();
});

client.login(token);