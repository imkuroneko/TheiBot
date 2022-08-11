const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) {
            return message.reply("🚨 **no tienes permiso para ejecutar este comando!**");
        }

        // ======================= Roles de alertas ========================
        message.channel.send({ embeds: [{
            color: 0xc676f5,
            title: '**📣 Roles de Alertas**',
            description: 'Si deseas recibir alertas específicas, haz clic en los botones de abajo para recibir el rol y estar al tanto de ello',
        }], components: [ new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rolesManager;665208554726359064').setLabel('RaffleAlert').setStyle(ButtonStyle.Secondary).setEmoji('🎫'),
            new ButtonBuilder().setCustomId('rolesManager;606674875557478416').setLabel('StreamAlert').setStyle(ButtonStyle.Secondary).setEmoji('🎥'),
        ) ] });


        // ======================= Roles de hobbies ========================
        message.channel.send({ embeds: [{
            color: 0xc676f5,
            title: '**🌌 Roles de Hobbies**',
            description: 'Haz clic en los botones de abajo para recibir el rol de cada hobbie con el que te identifiques',
        }], components: [ new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rolesManager;461330378691444767').setLabel('Developer').setStyle(ButtonStyle.Secondary).setEmoji('💻'),
            new ButtonBuilder().setCustomId('rolesManager;488012857909182464').setLabel('Artist').setStyle(ButtonStyle.Secondary).setEmoji('🎨'),
            new ButtonBuilder().setCustomId('rolesManager;467854409284452362').setLabel('Gamer').setStyle(ButtonStyle.Secondary).setEmoji('🎮'),
            new ButtonBuilder().setCustomId('rolesManager;528826642156748802').setLabel('Streamer').setStyle(ButtonStyle.Secondary).setEmoji('🎥'),
        ) ] });


        // ==================== Roles de colores únicos ====================
        message.channel.send({ embeds: [{
            color: 0xc676f5,
            title: '**🎨 Roles de Colores**',
            description: 'Haz clic en los botones de abajo para tener el rol con el color que mas te guste',
        }], components: [ new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rolesManager;908324747098595368').setLabel('#93b97d').setStyle(ButtonStyle.Secondary).setEmoji('878063019022753813'),
            new ButtonBuilder().setCustomId('rolesManager;908324738252820520').setLabel('#66c1bc').setStyle(ButtonStyle.Secondary).setEmoji('878063019182145536'),
            new ButtonBuilder().setCustomId('rolesManager;908324743814467595').setLabel('#ebda79').setStyle(ButtonStyle.Secondary).setEmoji('878063019110850610'),
            new ButtonBuilder().setCustomId('rolesManager;908324749615181824').setLabel('#7982ef').setStyle(ButtonStyle.Secondary).setEmoji('878063019110838312'),
            new ButtonBuilder().setCustomId('rolesManager;908324733706207303').setLabel('#ef7993').setStyle(ButtonStyle.Secondary).setEmoji('878063018955636747'),
        ) ] });

    } catch(error) {
        console.error('[error] cmdPrefix:embedroles |',error.message);
    }
}