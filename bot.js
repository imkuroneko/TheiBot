/* == Load bot configs ============================================================================== */
const config = require('./appconfig.json');

/* == Load bot resources ============================================================================ */
const { Client, Intents } = require('discord.js');
const stringSimilarity = require("string-similarity");

/* == Set bot token & define discord intents ======================================================== */
const fg = Intents.FLAGS;
const client = new Client({
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
    intents: [
        fg.GUILDS, fg.GUILD_INTEGRATIONS, fg.GUILD_WEBHOOKS,
        fg.GUILD_PRESENCES, fg.GUILD_VOICE_STATES,
        fg.GUILD_INVITES, fg.GUILD_MEMBERS, fg.GUILD_BANS,
        fg.GUILD_MESSAGES, fg.GUILD_MESSAGE_REACTIONS, fg.GUILD_MESSAGE_TYPING
    ]
});
client.login(config.discordBot.token);

/* == On bot ready ================================================================================== */
client.on('ready', ()=> {
    client.user.setActivity('nuggots! 🍗', {type: 'WATCHING'});

    const { joinVoiceChannel } = require('@discordjs/voice');
    const voiceChannel = client.channels.cache.get(config.presenceChannels.voice);

    joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false
    });

    console.log('%cBot Iniciado exitosamente', 'color:green');
});

/* == Monitor received messages ===================================================================== */
client.on('messageCreate', msg => {
    if(msg.author.bot) { return; } 

    const sender = client.channels.cache.find(channel => channel.id == msg.channel.id);

    message = msg.content.toLocaleLowerCase().trim();

    sendNuggot = false;
    nuggots_ = ['nugget', 'nuggot', 'nyuggot'];

    for(let index = 0; index < nuggots_.length; index++) {
        if(message.includes(nuggots_[index])) {
            sendNuggot = true;
        }
        if(stringSimilarity.compareTwoStrings(message, nuggots_[index]) > 0.75) {
            sendNuggot = true;
        }
    }

    if(sendNuggot) {
        msg.react('864676232737718292');
        msg.reply("Gimme nuggots! <:nuggots:864676232737718292>");
    }

});


/* == Monitor reactions to messages (cached) ======================================================== */
client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.partial) { await reaction.message.fetch(); }
    if(reaction.partial) { await reaction.fetch(); }
    if((!reaction.message.guild) || user.bot) { return; }

    message_id = reaction.message.id;
    role_name = reaction.emoji.name;
    user_g = reaction.message.guild.members.cache.get(user.id);

    if(reaction.message.channel.id == config.discordGuild.redeemRolesChannel) {
        switch(message_id) {
            case config.discordGuild.redeemUniqueRolesMsg:
                for(var key in config.alerts) {
                    if(role_name == key) {
                        await user_g.roles.add(config.alerts[key]);
                    } else {
                        reaction.remove(user_g);
                        await user_g.roles.remove(config.alerts[key]);
                    }
                }
                break;
            // ==================================================================================
            case config.discordGuild.redeemAlertRolesMsg:
                for(var key in config.alerts) {
                    if(role_name == key) { await user_g.roles.add(config.alerts[key]); }
                }
                break;
            // ==================================================================================
            case config.discordGuild.redeemDecorativeRolesMsg:
                for(var key in config.decorativeRoles) {
                    if(role_name == key) { await user_g.roles.add(config.decorativeRoles[key]); }
                }
                break;
        
        }
    } else { return; }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if(reaction.message.partial) { await reaction.message.fetch(); }
    if(reaction.partial) { await reaction.fetch(); }
    if((!reaction.message.guild) || user.bot) { return; }

    message_id = reaction.message.id;
    role_name = reaction.emoji.name;
    user_g = reaction.message.guild.members.cache.get(user.id);

    if(reaction.message.channel.id == config.discordGuild.redeemRolesChannel) {
        switch(message_id) {
            case config.discordGuild.redeemUniqueRolesMsg:
                for(var key in config.uniqueRoles) {
                    if(role_name == key) { await user_g.roles.remove(config.uniqueRoles[key]); }
                }
                break;
            // ==================================================================================
            case config.discordGuild.redeemAlertRolesMsg:
                for(var key in config.alerts) {
                    if(role_name == key) { await user_g.roles.remove(config.alerts[key]); }
                }
                break;
            // ==================================================================================
            case config.discordGuild.redeemDecorativeRolesMsg:
                for(var key in config.decorativeRoles) {
                    if(role_name == key) { await user_g.roles.remove(config.decorativeRoles[key]); }
                }
                break;
        
        }
    } else { return; }
});


/* == Monitor User Events =========================================================================== */
client.on('guildMemberAdd', (member) => {
    var user     = member.user.tag;
    var userId   = member.user.id;
    var username = member.user.username;
    var avatar   = member.user.displayAvatarURL();

    const sender_welcome = client.channels.cache.find(channel => channel.id == config.discordGuild.welcomeChannel);
    sender_welcome.send({ embeds: [{
        color: config.embeds.morado,
        title: 'Bienvenido '+username+' al servidor 👋🏻',
        description: "Esperamos que disfrutes tu estadía en el servidor.",
        thumbnail: { url: avatar },
        fields: [
            { name: '• Las reglas de mi comunidad', value: '<#751891992178327573>' },
            { name: '• Roles Chidoris y para alertas', value: '<#580615018261774346>' },
            { name: '• Sobre Mí y mis redes sociales', value: '<#637941772063866890>' }
        ],
        footer: config.embeds.footer
    }] });

    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.in_out);
    sender_log.send({ embeds: [{
        color: config.embeds.verde,
        title: `👋🏻 Un usuario se acaba de unir al servidor`,
        fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
        thumbnail: { url: avatar },
        footer: config.embeds.footer
    }] });
});

client.on('guildMemberRemove', (member) => {
    var user   = member.user.tag;
    var userId = member.user.id;
    var avatar = member.user.displayAvatarURL();

    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.in_out);
    sender_log.send({ embeds: [{
        color: config.embeds.rojo,
        title: `👋🏻 Un usuario se acaba de ir del servidor`,
        fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
        thumbnail: { url: avatar },
        footer: config.embeds.footer
    }] });
});


/* == Monitor User Sanction ========================================================================= */
client.on('guildBanAdd', (guild) => {
    var user   = guild.user.tag;
    var userId = guild.user.id;
    var avatar = guild.user.displayAvatarURL();

    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.ban);
    sender_log.send({ embeds: [{
        color: config.embeds.rojo,
        title: '👮🏻‍♀️ Un usuario fue baneado',
        fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
        thumbnail: { url: avatar },
        footer: config.embeds.footer
    }] });
});

client.on('guildBanRemove', (guild) => {
    var user   = guild.user.tag;
    var userId = guild.user.id;
    var avatar = guild.user.displayAvatarURL();

    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.ban);
    sender_log.send({ embeds: [{
        color: config.embeds.verde,
        title: '👮🏻‍♀️ Un usuario fue desbaneado',
        fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
        thumbnail: { url: avatar },
        footer: config.embeds.footer
    }] });
});


/* == Monitor Role Events =========================================================================== */
client.on('roleCreate', (role) => {
    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.server);
    sender_log.send({ embeds: [{
        color: config.embeds.verde,
        title: '📛 Nuevo Rol Creado',
        fields: [ { name: 'Nombre', value: role.name }, { name: 'ID', value: role.id } ],
        footer: config.embeds.footer
    }] });
});

client.on('roleDelete', (role) => {
    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.server);
    sender_log.send({ embeds: [{
        color: config.embeds.rojo,
        title: '📛 Rol Eliminado',
        fields: [ { name: 'Nombre', value: role.name }, { name: 'ID', value: role.id } ],
        footer: config.embeds.footer
    }] });
});


/* == Monitor Channel Events ======================================================================== */
client.on('channelCreate', (channel) => {
    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.server);
    sender_log.send({ embeds: [{
        color: config.embeds.verde,
        title: '📦 Nuevo Canal Creado',
        fields: [ { name: 'Nombre', value: channel.name }, { name: 'ID', value: channel.id } ],
        footer: config.embeds.footer
    }] });
});

client.on('channelDelete', (channel) => {
    const sender_log = client.channels.cache.find(channel => channel.id == config.channelsLogs.server);
    sender_log.send({ embeds: [{
        color: config.embeds.rojo,
        title: '📦 Canal Eliminado',
        fields: [ { name: 'Nombre', value: channel.name }, { name: 'ID', value: channel.id } ],
        footer: config.embeds.footer
    }] });
});



/* == Utilitaries Functions ========================================================================= */
function handleTimestamp(ts) {
    var date_ob = new Date(ts);
    var year = date_ob.getFullYear();
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var day = ("0" + date_ob.getDate()).slice(-2);
    var hours = ("0" + date_ob.getHours()).slice(-2);
    var minutes = ("0" + date_ob.getMinutes()).slice(-2);
    var seconds = ("0" + date_ob.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}