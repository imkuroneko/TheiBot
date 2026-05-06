// Load required resources =================================================================================================
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const path = require('path');

// Load custom functions ===================================================================================================
const { getChannelInfo, getChannelFeed } = require(path.resolve('./src/services/youtube'));
const { YoutubeChannel, YoutubeTracker } = require(path.resolve('./src/database/models'));

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Gestionar canales de YouTube')
        .addSubcommand(sub => sub
            .setName('add')
            .setDescription('Registrar un canal de YouTube para anuncios')
            .addStringOption(opt => opt
                .setName('handle')
                .setDescription('Handle del canal (ej: @MrBeast)')
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(30)
            )
            .addChannelOption(opt => opt
                .setName('canal_de_discord')
                .setDescription('Canal de Discord para los anuncios')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
                .addChannelTypes(ChannelType.GuildAnnouncement)
            )
            .addRoleOption(opt => opt
                .setName('rol_de_menciones')
                .setDescription('Rol para mencionar en los anuncios')
                .setRequired(false)
            )
        )
        .addSubcommand(sub => sub
            .setName('del')
            .setDescription('Eliminar un canal de YouTube registrado')
            .addStringOption(opt => opt
                .setName('handle')
                .setDescription('Handle del canal (ej: @MrBeast)')
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(30)
            )
        )
        .setDMPermission(false),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        try {
            if (sub === 'add') {
                const rawHandle    = interaction.options.getString('handle').trim();
                const handle       = rawHandle.startsWith('@') ? rawHandle.slice(1) : rawHandle;
                const ds_canal     = interaction.options.getChannel('canal_de_discord').id;
                const rol_menciones = interaction.options.getRole('rol_de_menciones')?.id ?? null;

                await interaction.deferReply({ ephemeral: true });

                const channelData = await getChannelInfo(handle);
                if (!channelData) {
                    return interaction.editReply({ content: '❌ Hooman, no existe ese canal en YouTube...' });
                }

                if (await YoutubeChannel.findOne({ where: { youtube_channel_id: channelData.id } }) !== null) {
                    return interaction.editReply({ content: '❌ Hooman, ya está registrado ese canal en mi base de datos...' });
                }

                await YoutubeChannel.create({
                    youtube_channel_id:      channelData.id,
                    youtube_channel_handle:  handle,
                    youtube_channel_name:    channelData.name,
                    youtube_channel_avatar:  channelData.avatar,
                    discord_channel_id:      ds_canal,
                    discord_mention_role_id: rol_menciones,
                });

                // Sembrar videos recientes para no generar alertas de contenido ya publicado
                const recentEntries = await getChannelFeed(channelData.id);
                for (const entry of recentEntries) {
                    if (!entry.videoId) { continue; }
                    await YoutubeTracker.findOrCreate({
                        where:    { video_id: entry.videoId },
                        defaults: { youtube_channel_id: channelData.id, published_at: entry.publishedAt },
                    });
                }

                return interaction.editReply({ content: `🙆🏻‍♀️ He registrado el canal **${channelData.name}** en mi base de datos hooman...` });
            }

            if (sub === 'del') {
                const rawHandle = interaction.options.getString('handle').trim();
                const handle    = rawHandle.startsWith('@') ? rawHandle.slice(1) : rawHandle;

                if (await YoutubeChannel.findOne({ where: { youtube_channel_handle: handle } }) === null) {
                    return interaction.reply({ content: '❌ Hooman, ese canal no se encuentra en mi base de datos...', ephemeral: true });
                }

                await YoutubeChannel.destroy({ where: { youtube_channel_handle: handle } });

                return interaction.reply({ content: '🙆🏻‍♀️ He eliminado el canal de YouTube de mi base de datos hooman...', ephemeral: true });
            }
        } catch(error) {
            console.error('[interaction:slashcmd:youtube]', error.message);
        }
    }
};
