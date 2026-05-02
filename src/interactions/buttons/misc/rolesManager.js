// Load required resources =================================================================================================
const path = require('path');

// Load configuration files ================================================================================================
const roles = require(path.resolve('./config/roles'));

// Module script ===========================================================================================================
module.exports = {
    name: 'rolesManager',
    async execute(interaction) {
        const data = interaction.customId.split(';');
        const roleId = data[1];
        const interact_user = interaction.guild.members.cache.get(interaction.user.id);

        const role_stackable = Object.values(roles.stackables).flat().find(r => r.id === roleId);
        if(role_stackable) { // Roles de Alertas y Hobbies
            if(!interaction.member.roles.cache.some(r => r.id === roleId)) {
                interact_user.roles.add(role_stackable.id);
                return interaction.reply({ content: "🙆🏻‍♀️ Te he otorgado el rol de `"+role_stackable.name+"`. ", ephemeral: true });
            } else {
                interact_user.roles.remove(role_stackable.id);
                return interaction.reply({ content: "🙆🏻‍♀️ Te he retirado el rol de `"+role_stackable.name+"`. ", ephemeral: true });
            }
        }

        const role_unique = Object.values(roles.unique).flat().find(r => r.id === roleId);
        if(role_unique) { // Roles de Colores
            for(let i = 0; i < roles.unique.colores.length; i++) {
                if(role_unique.id == roles.unique.colores[i].id) {
                    interact_user.roles.add(roles.unique.colores[i].id);
                } else {
                    interact_user.roles.remove(roles.unique.colores[i].id);
                }
            }
            return interaction.reply({ content: "🎨 Te he otorgado el color `"+role_unique.name+"`. ", ephemeral: true });
        }

    }
};
