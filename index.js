// Load required resources =================================================================================================
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { color } = require('console-log-colors');
const path = require('path');
const fs = require('fs');

// Load configuration files ================================================================================================
const { token } = require(path.resolve('./config/bot'));

// Define client Intents ===================================================================================================
const client = new Client({
    intents: [
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping
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

// Track load time =========================================================================================================
client.startupTime = Date.now();

// Admin Commands (with prefix) ============================================================================================
try {
    client.commandsPrefix = new Collection();
    var pathFiles = './commands';
    fs.readdirSync(pathFiles).forEach(folder => {
        fs.readdirSync(`${pathFiles}/${folder}`).filter(file => file.endsWith('.js')).forEach((file) => {
            client.commandsPrefix.set(file.split(".")[0], require(path.resolve(path.join(`${pathFiles}/${folder}`, file))));
        });
    });
} catch(error) {
    console.error(color.red('[load:cmds]'), error.message);
}

// Interactions :: SlashCommands ===========================================================================================
try {
    client.slashRegister = [];
    client.interactionsSlash = new Collection();
    var pathFiles = './interactions/slashCommands';
    fs.readdirSync(pathFiles).forEach(folder => {
        fs.readdirSync(`${pathFiles}/${folder}`).filter(file => file.endsWith('.js')).forEach((file) => {
            var command = require(path.resolve(path.join(`${pathFiles}/${folder}`, file)));
            client.slashRegister.push(command.data.toJSON());
            client.interactionsSlash.set(command.data.name, command);
        });
    });
} catch(error) {
    console.error(color.red('[load:interactions:slash]'), error.message);
}

// Interactions :: Buttons =================================================================================================
try {
    client.interactionsButtons = new Collection();
    var pathFiles = './interactions/buttons';
    fs.readdirSync(pathFiles).forEach(folder => {
        fs.readdirSync(`${pathFiles}/${folder}`).filter(file => file.endsWith('.js')).forEach((file) => {
            client.interactionsButtons.set(file.split(".")[0], require(path.resolve(path.join(`${pathFiles}/${folder}`, file))));
        });
    });
} catch(error) {
    console.error(color.red('[load:interactions:button]'), error.message);
}

// Interactions :: Menus ===================================================================================================
try {
    client.interactionsSelectMenu = new Collection();
    var pathFiles = './interactions/selectMenu';
    fs.readdirSync(pathFiles).forEach(folder => {
        fs.readdirSync(`${pathFiles}/${folder}`).filter(file => file.endsWith('.js')).forEach((file) => {
            client.interactionsSelectMenu.set(file.split(".")[0], require(path.resolve(path.join(`${pathFiles}/${folder}`, file))));
        });
    });
} catch(error) {
    console.error(color.red('[load:interactions:menu]'), error.message);
}

// Handle :: Events ========================================================================================================
try {
    var pathFiles = './events';
    fs.readdirSync(pathFiles).forEach(folder => {
        fs.readdirSync(`${pathFiles}/${folder}`).filter(file => file.endsWith('.js')).forEach((file) => {
            const event = require(path.resolve(path.join(`${pathFiles}/${folder}`, file)));
            client.on(event.name, (...args) => event.execute(...args));    
        });
    });
} catch(error) {
    console.error(color.red('[load:events]'), error.message);
}

// Define token a init bot =================================================================================================
client.login(token).then(() => {
    console.log(color.green('[init]'), 'Bot operativo | Inicializado en', color.magenta(`${Date.now() - client.startupTime}ms`));
}).catch((error) => {
    console.error(color.red('[client:token]'), error.message);
});

// Handle Error ============================================================================================================
process.on('unhandledRejection', (error) => {
    console.error(color.red('[process:unhandledError]'), error.message);
});

client.on('shardError', (error) => {
    console.error(color.red('[process:shardError]'), error.message);
});