// Load required resources =================================================================================================
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { ownerId, embedColor } = require(path.resolve('./config/bot'));
const embedRoles = require(path.resolve('./data/i18n/roles'));
const roles = require(path.resolve('./config/roles'));

// Module script ===========================================================================================================
exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) {
            return message.reply("🚨 **no tienes permiso para ejecutar este comando!**");
        }

        const stackable = roles.stackables;
        Object.keys(stackable).forEach(key => {
            if(!embedRoles[key]) { return; }

            let buttonsRoles = [];
            stackable[key].forEach((rol) => {
                buttonsRoles.push(new ButtonBuilder().setCustomId(`rolesManager;${rol.id}`).setLabel(rol.name).setStyle(ButtonStyle.Secondary).setEmoji(rol.emoji));
            });

            message.channel.send({
                embeds: [{
                    color: parseInt(embedColor, 16),
                    title: embedRoles[key].title,
                    description: embedRoles[key].description,
                }],
                components: [ new ActionRowBuilder().addComponents(buttonsRoles) ]
            }).catch((error) => {
                console.error('[cmdPrefix:embedroles:stackable]', error.message);
            });
        });
        
        const unique = roles.unique;
        Object.keys(unique).forEach(key => {
            if(!embedRoles[key]) { return; }

            let buttonsRoles = [];
            unique[key].forEach((rol) => {
                buttonsRoles.push(new ButtonBuilder().setCustomId(`rolesManager;${rol.id}`).setLabel(rol.name).setStyle(ButtonStyle.Secondary).setEmoji(rol.emoji));
            });

            message.channel.send({
                embeds: [{
                    color: parseInt(embedColor, 16),
                    title: embedRoles[key].title,
                    description: embedRoles[key].description,
                }],
                components: [ new ActionRowBuilder().addComponents(buttonsRoles) ]
            }).catch((error) => {
                console.error('[cmdPrefix:embedroles:unique]', error.message);
            });
        });
    } catch(error) {
        console.error('[cmdPrefix:embedroles]', error.message);
    }
}
