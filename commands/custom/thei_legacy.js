const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config/bot.json');
const roles = require('../../config/self_roles.json');
const channels = require('../../config/channels.json');

module.exports = {
    name: 'messageCreate',
    async execute(msg) {

        // Evitar bots
        if(msg.author.bot) { return; } 

        // Contenido del mensaje [inicial]
        msg_guild   = msg.guild;
        msg_content = msg.content.toLocaleLowerCase().trim();

        // Evitar que el bot no actue en otro discord
        if(msg_guild != config.guildId) { return; }

        // Thei loves nuggots 🍗
        nuggots_ = ['nugget', 'nuggot', 'nyuggot', 'nuggat'];
        for(let index = 0; index < nuggots_.length; index++) {
            if(msg_content.includes(nuggots_[index])) {
                msg.react('864676232737718292');
                msg.reply("Gimme nuggots! <:nuggots:864676232737718292>");
            }
        }

        // Thei is watching you 👀
        if(msg_content.includes('thei') && msg_content != 'thei_roles') {
            msg.react('👀');
            msg.react('🦄');
            msg.react('🔪');
            msg.reply("How dare you hooman! ");
        }

        if(msg_content == 'thei_roles' && msg.author == config.ownerId) {
            msg.delete();

            const embed_sender = msg.client.channels.cache.get(channels.takeYourRole);

            // Roles de Alertas ============================================================================================
            const row_alertas = new MessageActionRow()
                .addComponents(
                    new MessageButton().setCustomId(roles.alertas.streams).setLabel('🎥 Streams').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.alertas.sorteos).setLabel('🎫 Sorteos').setStyle('SECONDARY')
                );

            embed_sender.send({ components: [row_alertas],  embeds: [{
                color: 0xcc3366,
                title: '📣 Roles de Alertas',
                description: 'Haz clic en los botones de abajo para recibir los roles y estar al tanto de todo!',
            }] });
            // Roles de Hobbies ============================================================================================
            const row_hobbies = new MessageActionRow()
                .addComponents(
                    new MessageButton().setCustomId(roles.hobbies.dev).setLabel('💻 Developer').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.hobbies.artist).setLabel('🎨 Artista').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.hobbies.gamer).setLabel('🎮 Gamer').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.hobbies.streamer).setLabel('🎥 Streamer').setStyle('SECONDARY')
                );

            embed_sender.send({ components: [row_hobbies],  embeds: [{
                color: 0xcc3366,
                title: '🌌 Roles de Hobbies',
                description: 'Haz clic en los botones de abajo para recibir el rol de cada hobbie con el que te identifiques!',
            }] });

            // Roles de Colores ============================================================================================
            const row_colores = new MessageActionRow()
                .addComponents(
                    new MessageButton().setCustomId(roles.colores.c_93b97d).setLabel('🌿 Verde').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.colores.c_66c1bc).setLabel('🐋 Celeste').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.colores.c_ebda79).setLabel('🍯 Amarillo').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.colores.c_7982ef).setLabel('🟣 Morado').setStyle('SECONDARY'),
                    new MessageButton().setCustomId(roles.colores.c_ef7993).setLabel('🎀 Rosado').setStyle('SECONDARY')
                );

            embed_sender.send({ components: [row_colores],  embeds: [{
                color: 0xcc3366,
                title: '🎨 Roles de Colores',
                description: 'Haz clic en los botones de abajo para tener el color que mas te guste!',
            }] });
        }
    }
};