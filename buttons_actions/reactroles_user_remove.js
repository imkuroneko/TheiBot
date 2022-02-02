const roles = require('../config/self_roles.json');
const channels = require('../config/channels.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        // 938245623495393300

        if(!interaction.isCommand()) return;

        if(interaction.commandName === 'ping') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('primary')
                        .setLabel('Primary')
                        .setStyle('PRIMARY'),
                );
    
            await interaction.reply({ content: 'Pong!', components: [row] });
        }


        /*
        // Params
        const react_id = reaction.emoji.id;
        const user_g   = reaction.message.guild.members.cache.get(user.id);

        // Search and handle
        for(var type of Object.keys(roles)) {
            for(let i = 0; i < roles[type].roles.length; i++) {
                if(react_id === roles[type].roles[i].emoji_id) {
                    await user_g.roles.remove(roles[type].roles[i].role_id).catch((e) => {});
                }
            }
        }
        */
    }
};
