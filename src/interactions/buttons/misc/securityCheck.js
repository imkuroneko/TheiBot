// Load required resources =================================================================================================
const path = require('path');

// Load configuration files ================================================================================================
const { defaultRole } = require(path.resolve('./config/roles'));

// Module script ===========================================================================================================
module.exports = {
    name: 'securityCheck',
    async execute(interaction) {
        const interact_user = interaction.guild.members.cache.get(interaction.user.id);

        if(!interaction.member.roles.cache.some(r => r.id === defaultRole)) {
            interact_user.roles.add(defaultRole);
            return interaction.reply({ content: `✔ Se te ha otorgado el rol de <@&${defaultRole}>.`, ephemeral: true });
        } else {
            return interaction.reply({ content: `❌ Ya cuentas con el rol de <@&${defaultRole}>.`, ephemeral: true });
        }
    }
};