const { clientId, ownerId, token } = require('../../config/bot.json');

const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const fs = require('fs');

exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) {
            message.reply("🚨 **no tienes permiso para ejecutar este comando!**");
        }

        const rest = new REST({ version: '10' }).setToken(token);

        rest.put(Routes.applicationCommands(clientId), { body: client.slashRegister }).then(() => {
            message.reply('🦄 Todos los comandos fueron registrados/actualizados!');
        }).catch((error) => {
            console.error('prfx cmd slashregister ::'+error.message);
        });
    } catch (error) {
        console.error('prfx cmd slashregister ::'+error.message);
    }
}