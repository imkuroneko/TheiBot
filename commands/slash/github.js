const axios = require('axios');

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Ver información de un perfil de github.')
        .addStringOption(option => option.setName('user').setDescription('el perfil de github a buscar').setRequired(true))
        .setDMPermission(false),
    async execute(interaction) {
        try{
            const user = interaction.options.getString('user').replace(/[^\w]/g, "");

            if(user == null) {
                return interaction.reply({ content: 'Usuario no válido', ephemeral: true });
            }

            let res = await axios({
                method: 'get',
                url: `https://api.github.com/users/${user}`,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(!res.data) {
                return interaction.reply({ content: 'No se pudo obtener la información de la cuenta', ephemeral: true });
            }

            const info = res.data;

            if(info.message) {
                return interaction.reply({ content: '😾 **GitHub Response:** `'+info.message+'`', ephemeral: true });
            }

            const tz = Math.floor(new Date(info.created_at).getTime() / 1000);

            if(info.bio == null) {
                bio = 'No tiene';
            } else {
                bio = info.bio;
            }

            return interaction.reply({ embeds: [{
                color: 0xf58540,
                title: `🐈 Información de la cuenta de GitHub`,
                thumbnail: { url: info.avatar_url },
                fields: [
                    { inline: false, name: '👤 Usuario', value: `${info.login} (${info.name})` },
                    { inline: false, name: '💭 Bio', value: bio },
                    { inline: true, name: '✨ Seguidores', value: info.followers },
                    { inline: true, name: '✨ Siguiendo', value: info.following },
                    { inline: false, name: '📦 Repositorios Públicos', value: info.public_repos },
                    { inline: false, name: '💻 Tipo de Perfil', value: ((info.type == 'User') ? 'Usuario' : 'Organización') },
                    { inline: false, name: '🗓️ Cuenta creada el' , value: `<t:${tz}:F> (<t:${tz}:R>)` },
                ]
            }] });
        } catch(error) {
            console.error('[error] cmdSlash:github |', error.message);
        };
    }
};
