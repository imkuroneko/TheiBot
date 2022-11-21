// Load required resources =================================================================================================
const path = require('path');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

// Load configuration files ================================================================================================
const { clientId, ownerId, token } = require(path.resolve('./config/bot.json'));

// Module script ===========================================================================================================
exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) {
            return message.reply("🚨 **no tienes permiso para ejecutar este comando!**");
        }

        const rest = new REST({ version: '10' }).setToken(token);

        rest.put(Routes.applicationCommands(clientId), { body: client.slashRegister }).then(() => {
            return message.reply('🦄 **Se han registrado/actualizado los comandos slash**');
        }).catch((error) => {
            return message.reply('🦄 **Hubo un inconveniente al registar/actualizar los comandos**\n```'+error.message+'```');
        });
    } catch(error) {
        console.error('cmdPrefix:slashregister |',error.message);
    }
}