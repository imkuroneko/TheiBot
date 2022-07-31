module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if(!interaction.isChatInputCommand()) { return; }

        const command = interaction.client.commandsSlash.get(interaction.commandName);

        if(!command) { return; }

        try {
            await command.execute(interaction);
        } catch(error) {
            console.error('interactionCreate :: '+error.message);
            return interaction.reply({ content: 'oops! hubo un error al ejecutar el comando 😣', ephemeral: true });
        }
    }
};
