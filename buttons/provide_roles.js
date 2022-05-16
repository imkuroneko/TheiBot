const roles = require('../config/roles.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if(!interaction.isButton()) { return; }

        const button_role_id = interaction.customId;
        const interact_user = interaction.guild.members.cache.get(interaction.user.id);

        const role_stackable = Object.values(roles.stackables).flat().find(r => r.id === button_role_id);
        if(role_stackable) { // Roles de Alertas y Hobbies
            if(!interaction.member.roles.cache.some(r => r.id === button_role_id)) {
                interact_user.roles.add(role_stackable.id);
                return interaction.reply({ content: "<:theiStonks:905161849459314789> Te he otorgado el rol de `"+role_stackable.name+"`. ", ephemeral: true });
            } else {
                interact_user.roles.remove(role_stackable.id);
                return interaction.reply({ content: "<:theiNoStonks:905161849803259934> Te he retirado el rol de `"+role_stackable.name+"`. ", ephemeral: true });
            }
        }

        const role_unique = Object.values(roles.unique).flat().find(r => r.id === button_role_id);
        if(role_unique) { // Roles de Colores
            for(let i = 0; i < roles.unique.colores.length; i++) {
                if(role_unique.id == roles.unique.colores[i].id) {
                    interact_user.roles.add(roles.unique.colores[i].id);
                } else {
                    interact_user.roles.remove(roles.unique.colores[i].id);
                }
            }
            return interaction.reply({ content: "<:theiStonks:905161849459314789> Te he otorgado el color `"+role_unique.name+"`. ", ephemeral: true });
        }

    }
};
