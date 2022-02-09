// https://discord.com/api/oauth2/authorize?client_id=815807932653633547&permissions=8&scope=applications.commands%20bot
//                                                         ^ add botId here~

// Load configuration files ================================================================================================
const { clientId, token } = require('./config/bot.json');
const channels = require('./config/channels.json');

// Load required resources =================================================================================================
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

// Define client Intents ===================================================================================================
const fg = Intents.FLAGS;
const client = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents: [
        fg.GUILDS, fg.GUILD_INTEGRATIONS, fg.GUILD_WEBHOOKS,
        fg.GUILD_PRESENCES, fg.GUILD_VOICE_STATES,
        fg.GUILD_INVITES, fg.GUILD_MEMBERS, fg.GUILD_BANS,
        fg.GUILD_MESSAGES, fg.GUILD_MESSAGE_REACTIONS, fg.GUILD_MESSAGE_TYPING
    ]
});

// Load slash commands =====================================================================================================
client.commandsSlash = new Collection();
const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));
for(const slashFile of slashCommandFiles) {
    var commandName = slashFile.split(".")[0];
	var command = require(`./commands/slash/${slashFile}`);
	client.commandsSlash.set(command.data.name, command);
    console.log(`[Init] Recurso cargado: ${commandName}`);
}

// Custom Commands (with prefix) ===========================================================================================
client.commandsPrefix = new Collection();
const prefixCommandFiles = fs.readdirSync('./commands/prefix').filter(file => file.endsWith(".js"));
for(const prefixFile of prefixCommandFiles) {
    var commandName = prefixFile.split(".")[0];
    var command = require(`./commands/prefix/${prefixFile}`);
    client.commandsPrefix.set(commandName, command);
    console.log(`[Init] Recurso cargado: ${commandName}`);
}

// Handle :: Buttons Actions ===============================================================================================
const buttons = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for(const button of buttons) {
    const buttonName = button.split('.')[0];
    const event = require(`./buttons/${button}`);
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`[Init] Recurso cargado: ${buttonName}`);
}

// Handle :: Events ========================================================================================================
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of events) {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`[Init] Evento cargado:  ${eventName}`);
}

// Define token a init bot =================================================================================================
client.login(token);