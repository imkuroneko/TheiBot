// Load required resources =================================================================================================
const path = require('path');
const { Routes, REST } = require('discord.js');

// Load configuration files ================================================================================================
const { clientId, ownerId, token } = require(path.resolve('./config/bot'))

// Module script ===========================================================================================================
exports.run = async (client, message, args) => {
    try {
        if(message.author.id != ownerId) { return; }

        const rest = new REST({ version: '10' }).setToken(token);

        // Borrar comandos globales (si los hay)
        await rest.put(Routes.applicationCommands(clientId), { body: [] });

        // Borrar comandos de guild (si los hay)
        await rest.put(Routes.applicationGuildCommands(clientId, message.guild.id), { body: [] });

        return message.reply('🦄 Todos los comandos slash fueron eliminados');
    } catch(error) {
        message.reply('`[cmdPrefix:slashdeleter]` error: '+error.message);
        console.error('[cmdPrefix:slashdeleter]', error.message);
    }
}