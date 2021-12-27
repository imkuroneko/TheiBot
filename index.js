// https://discord.com/api/oauth2/authorize?client_id=____________&permissions=8&scope=applications.commands%20bot
//                                                         ^ add botId here~

// Load configuration files ================================================================================================
const { clientId, token, guildId } = require('./config/bot.json');
const channels = require('./config/channels.json');

// Load required resources =================================================================================================
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');

// Define client Intents ===================================================================================================
const fg = Intents.FLAGS;
const client = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'CHANNEL' ],
    intents: [
        fg.GUILDS, fg.GUILD_INTEGRATIONS, fg.GUILD_WEBHOOKS,
        fg.GUILD_PRESENCES, fg.GUILD_VOICE_STATES,
        fg.GUILD_INVITES, fg.GUILD_MEMBERS, fg.GUILD_BANS,
        fg.GUILD_MESSAGES, fg.GUILD_MESSAGE_REACTIONS, fg.GUILD_MESSAGE_TYPING
    ]
});

// Load slash commands =====================================================================================================
client.commands = new Collection();
const slashCommandFiles = fs.readdirSync('./commands_slash').filter(file => file.endsWith('.js'));
for(const slashFile of slashCommandFiles) {
	const command = require(`./commands_slash/${slashFile}`);
	client.commands.set(command.data.name, command);
}

// When bot is up ==========================================================================================================
client.once('ready', () => {
    client.user.setActivity('nuggots! 🍗', {type: 'WATCHING'});

    if(channels.presenceVoice.length > 0) {
        const { joinVoiceChannel } = require('@discordjs/voice');
        const voiceChannel = client.channels.cache.get(channels.presenceVoice);
    
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false
        });
    }

    console.log('Bot Iniciado exitosamente');
});

// Test ====================================================================================================================
const sender_welcome = client.channels.cache.find(channel => channel.id == channels.welcomeChannel);
const sender_log = client.channels.cache.find(channel => channel.id == channels.log_JoinLeft);

// Load slash commands when join to server =================================================================================
client.on('guildCreate', async (guild) => {
    // add the server to the list
    var guildsList = require('./config/guilds.json');
    guildsList.push(guild.id);
    var new_data = JSON.stringify(guildsList);
    fs.writeFile('./config/guilds', new_data, 'utf8', callback);

    // register the slash commands on the new guild
    const commands = [];
    const commandFiles = fs.readdirSync('./commands_slash').filter(file => file.endsWith('.js'));
    for(const file of commandFiles) {
        const command = require(`./commands_slash/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(token);
    rest.put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
});

// Handle Slash Interactions ===============================================================================================
client.on('interactionCreate', async (interaction) => {
	if(!interaction.isCommand()) { return; }

	const command = client.commands.get(interaction.commandName);

	if(!command) { return; }

	try {
		await command.execute(interaction);
	} catch(error) {
		console.error(error);
		return interaction.reply({
            content: 'oops! hubo un error al ejecutar el comando 😣',
            ephemeral: true
        });
	}
});

// Custom Commands (with prefix) ===========================================================================================
const customCommands = fs.readdirSync('./commands_custom').filter(file => file.endsWith('.js'));
for(const custCommFile of customCommands) {
    const event = require(`./commands_custom/${custCommFile}`);
    client.on(event.name, (...args) => event.execute(...args));
}

// Handle :: Reactions / Guild Events (Create/Modif/Delete Channels) =======================================================
const actionsFiles = fs.readdirSync('./commands_actions').filter(file => file.endsWith('.js'));
for(const actionFile of actionsFiles) {
    const event = require(`./commands_actions/${actionFile}`);
    client.on(event.name, (...args) => event.execute(...args));
}

// Temporal :: Log User Events (Join/Leave) ================================================================================
client.on('guildMemberAdd', (member) => {
    if(member.guild.id != guildId) { return; }

    var user     = member.user.tag;
    var userId   = member.user.id;
    var username = member.user.username;
    var avatar   = member.user.displayAvatarURL();

    if(channels.welcomeChannel.length > 0) {
        const sender_welcome = client.channels.cache.get(channels.welcomeChannel);
        sender_welcome.send({ embeds: [{
            color: 0xcc3366,
            title: 'Bienvenido '+username+' al servidor 👋🏻',
            description: "Esperamos que disfrutes tu estadía en el servidor.",
            fields: [
                { name: '• Las reglas de mi comunidad', value: '<#751891992178327573>' },
                { name: '• Roles Chidoris y para alertas', value: '<#580615018261774346>' },
                { name: '• Sobre Mí y mis redes sociales', value: '<#637941772063866890>' }
            ],
            footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
        }] });
    }

    if(channels.log_JoinLeft.length > 0) {
        const sender_log = client.channels.cache.get(channels.log_JoinLeft);
        sender_log.send({ embeds: [{
            color: 0x89db4f,
            title: `👋🏻 Un usuario se acaba de unir al servidor`,
            fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
            footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
        }] });
    }
});

client.on('guildMemberRemove', (member) => {
    if(member.guild.id != guildId) { return; }

    if(channels.log_JoinLeft.length > 0) {
        var user   = member.user.tag;
        var userId = member.user.id;
        var avatar = member.user.displayAvatarURL();

        const sender_log = client.channels.cache.get(channels.log_JoinLeft);
        sender_log.send({ embeds: [{
            color: 0xe35d5d,
            title: `👋🏻 Un usuario se acaba de ir del servidor`,
            fields: [ { name: 'Usuario', value: user }, { name: 'User ID', value: userId } ],
            // thumbnail: { url: avatar },
            footer: { text: '🦄 Thei Bot / Experimental Project by KuroNeko' }
        }] });
    }
});

// Define token a init bot =================================================================================================
client.login(token);
