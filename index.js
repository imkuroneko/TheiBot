// https://discord.com/api/oauth2/authorize?client_id=815807932653633547&permissions=8&scope=applications.commands%20bot
//                                                         ^ add botId here~

// Load configuration files ================================================================================================
const { token } = require('./config/bot.json');

// Load required resources =================================================================================================
const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection, SlashCommandBuilder } = require('discord.js');

// Define client Intents ===================================================================================================
const client = new Client({
    intents: [
        GatewayIntentBits.GuildBans,
        // GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        // GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        // GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ]
});

// Load slash commands =====================================================================================================
client.commandsSlash = new Collection();
client.slashRegister = [];
const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));
for(const slashFile of slashCommandFiles) {
    var commandName = slashFile.split(".")[0];
	var command = require(`./commands/slash/${slashFile}`);

    client.slashRegister.push(command.data.toJSON());
	client.commandsSlash.set(command.data.name, command);
}

// Custom Commands (with prefix) ===========================================================================================
client.commandsPrefix = new Collection();
const prefixCommandFiles = fs.readdirSync('./commands/prefix').filter(file => file.endsWith(".js"));
for(const prefixFile of prefixCommandFiles) {
    var commandName = prefixFile.split(".")[0];
    var command = require(`./commands/prefix/${prefixFile}`);
    client.commandsPrefix.set(commandName, command);
}

// Handle :: Buttons Actions ===============================================================================================
const buttons = fs.readdirSync('./actions/buttons').filter(file => file.endsWith('.js'));
for(const button of buttons) {
    const event = require(`./actions/buttons/${button}`);
    client.on(event.name, (...args) => event.execute(...args));
}

// Handle :: Events ========================================================================================================
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of events) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
}

// Define token a init bot =================================================================================================
client.login(token).catch((error) => {
    console.log(error.message);
});