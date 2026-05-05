// Load required resources =================================================================================================
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');

// Load configuration files ================================================================================================
const { embedColor } = require(path.resolve('./config/bot'));

// Load custom functions ===================================================================================================
const { BotActivity } = require(path.resolve('./src/database/models'));

const VALID_TYPES = ['watching', 'playing', 'listening', 'competing', 'streaming'];

// Module script ===========================================================================================================
module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Gestionar las actividades/presencias del bot')
        .addSubcommand(sub => sub
            .setName('add')
            .setDescription('Agregar una nueva actividad')
            .addStringOption(opt => opt
                .setName('tipo')
                .setDescription('Tipo de actividad')
                .setRequired(true)
                .addChoices(
                    { name: 'Viendo',        value: 'watching'  },
                    { name: 'Jugando',       value: 'playing'   },
                    { name: 'Escuchando',    value: 'listening' },
                    { name: 'Compitiendo',   value: 'competing' },
                    { name: 'Transmitiendo', value: 'streaming' },
                )
            )
            .addStringOption(opt => opt
                .setName('mensaje')
                .setDescription('Texto de la actividad')
                .setRequired(true)
                .setMaxLength(128)
            )
        )
        .addSubcommand(sub => sub
            .setName('remove')
            .setDescription('Eliminar una actividad por su ID')
            .addIntegerOption(opt => opt
                .setName('id')
                .setDescription('ID de la actividad (ver con /activity list)')
                .setRequired(true)
                .setMinValue(1)
            )
        )
        .addSubcommand(sub => sub
            .setName('list')
            .setDescription('Ver todas las actividades guardadas')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        try {
            if (sub === 'add') {
                const type    = interaction.options.getString('tipo');
                const message = interaction.options.getString('mensaje');

                const entry = await BotActivity.create({ type, message });

                return interaction.reply({ embeds: [{
                    color: parseInt(embedColor, 16),
                    title: '✅ Actividad agregada',
                    fields: [
                        { name: 'ID',      value: `\`${entry.id}\``,      inline: true },
                        { name: 'Tipo',    value: `\`${entry.type}\``,    inline: true },
                        { name: 'Mensaje', value: `\`${entry.message}\``, inline: false },
                    ]
                }], ephemeral: true });
            }

            if (sub === 'remove') {
                const id      = interaction.options.getInteger('id');
                const deleted = await BotActivity.destroy({ where: { id } });

                if (!deleted) {
                    return interaction.reply({ content: `No existe una actividad con ID \`${id}\`.`, ephemeral: true });
                }

                return interaction.reply({ embeds: [{
                    color: parseInt(embedColor, 16),
                    title: '🗑️ Actividad eliminada',
                    description: `La actividad con ID \`${id}\` fue eliminada.`,
                }], ephemeral: true });
            }

            if (sub === 'list') {
                const all = await BotActivity.findAll({ order: [['id', 'ASC']] });

                if (!all.length) {
                    return interaction.reply({ content: 'No hay actividades guardadas.', ephemeral: true });
                }

                const lines = all.map(a => `\`${String(a.id).padStart(3, '0')}\` **${a.type}** — ${a.message}`);
                const chunks = [];
                let current = '';
                for (const line of lines) {
                    if ((current + '\n' + line).length > 4000) {
                        chunks.push(current);
                        current = line;
                    } else {
                        current = current ? current + '\n' + line : line;
                    }
                }
                if (current) { chunks.push(current); }

                return interaction.reply({ embeds: chunks.map((desc, i) => ({
                    color: parseInt(embedColor, 16),
                    title: i === 0 ? `🎭 Actividades del bot (${all.length})` : undefined,
                    description: desc,
                })), ephemeral: true });
            }
        } catch (error) {
            console.error('[interaction:slashcmd:activity]', error.message);
        }
    }
};