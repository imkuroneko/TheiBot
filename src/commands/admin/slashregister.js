// Load required resources =================================================================================================
const path = require('path');
const { Routes, REST } = require('discord.js');

// Load configuration files ================================================================================================
const { clientId, ownerId, token } = require(path.resolve('./config/bot'))

// Module script ===========================================================================================================
exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) { return; }

        const rest = new REST({ version: '10' }).setToken(token);

        rest.put(Routes.applicationCommands(clientId), { body: client.slashRegister }).then((response) => {
            rest.put(Routes.applicationGuildCommands(clientId, message.guild.id), { body: client.slashRegister }).then((response2) => {
                message.reply(`🦄 Se registraron: ${response.length} comandos **de forma global** y ${response2.length} **en la guild**\n-# (Espera unos minutos hasta se reflejen los cambios)`);
            }).catch((error) => {
                message.reply(`\`[🦄 cmdPrefix:slashregister]\` ${error.message}`);
                console.error('[cmdPrefix:slashregister]', error.message);
            });
        }).catch((error) => {
            message.reply(`\`[🦄 cmdPrefix:slashregister]\` ${error.message}`);
            console.error('[cmdPrefix:slashregister]', error.message);
        });
    } catch(error) {
        message.reply('`[cmdPrefix:slashregister]` error: '+error.message);
        console.error('[cmdPrefix:slashregister]', error.message);
    }
}