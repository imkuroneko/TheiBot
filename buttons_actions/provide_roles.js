const roles = require('../config/self_roles.json');
const channels = require('../config/channels.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if(!interaction.isButton()) { return; }

        const role_id = interaction.customId;
        const user = interaction.guild.members.cache.get(interaction.user.id);

        // Roles de Alertas
        for(let i = 0; i < roles.alertas.length; i++) {
            if(role_id == roles.alertas[i].id) {
                var r_name = roles.alertas[i].name;
                if(!interaction.member.roles.cache.some(r => r.id === role_id)) {
                    user.roles.add(role_id);
                    return interaction.reply({ content: "<:theiStonks:905161849459314789> Te he otorgado el rol de `"+r_name+"`. ", ephemeral: true });
                } else {
                    user.roles.remove(role_id);
                    return interaction.reply({ content: "<:theiNoStonks:905161849803259934> Te he retirado el rol de `"+r_name+"`. ", ephemeral: true });
                }
            }
        }

        // Roles de Hobbies
        for(let i = 0; i < roles.hobbies.length; i++) {
            if(role_id == roles.hobbies[i].id) {
                var r_name = roles.hobbies[i].name;
                if(!interaction.member.roles.cache.some(r => r.id === role_id)) {
                    user.roles.add(role_id);
                    return interaction.reply({ content: "<:theiStonks:905161849459314789> Te he otorgado el rol de `"+r_name+"`. ", ephemeral: true });
                } else {
                    user.roles.remove(role_id);
                    return interaction.reply({ content: "<:theiNoStonks:905161849803259934> Te he retirado el rol de `"+r_name+"`. ", ephemeral: true });
                }
            }
        }

        // Roles de Colores
        var color_role = false;
        var color_id_give = '';
        var r_name = '';
        for(let i = 0; i < roles.colores.length; i++) {
            if(role_id == roles.colores[i].id) {
                color_role = true;
                r_name = roles.colores[i].name;
                color_id_give = roles.colores[i].id;
            }
        }

        if(color_role) {
            for(let i = 0; i < roles.colores.length; i++) {
                if(roles.colores[i].id == color_id_give) {
                    user.roles.add(color_id_give);
                    return interaction.reply({ content: "<:theiStonks:905161849459314789> Te he otorgado el color `"+r_name+"`. ", ephemeral: true });
                } else {
                    user.roles.remove(roles.colores[i].id);
                }
            }
        }
    }
};
