const { clientId, guildId, ownerId, token } = require('../../config/bot.json');

const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const fs = require('fs');

exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) {
            return message.reply("🚨 **no tienes permiso para ejecutar este comando!**");
        }

        const rest = new REST({ version: '10' }).setToken(token);

        // para borrar todos los de este guild
        rest.get(Routes.applicationGuildCommands(clientId, guildId)).then((data) => {
            const promises = [];
            for(const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            Promise.all(promises);
        });

        // para borrar del global
        rest.get(Routes.applicationCommands(clientId)).then((data) => {
            const promises = [];
            for(const command of data) {
                const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            Promise.all(promises);
        });

        return message.reply('🦄 Todos los comandos slash fueron eliminados (global y del guild)');

    } catch (error) {
        console.error('[error] cmdPrefix:slashdeleter |',error.message);
    }
}