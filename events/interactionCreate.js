// Load required resources =================================================================================================
const { Events } = require('discord.js');

// Module script ===========================================================================================================
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if(interaction.isChatInputCommand()) {
            try {
                const command = interaction.client.commandsSlash.get(interaction.commandName);
                if(!command) { return; }

                await command.execute(interaction);
            } catch(error) {
                console.error('event:interactionCreate |',error.message);
                return interaction.reply({ content: 'oops! hubo un error al ejecutar el comando 😣', ephemeral: true });
            }
        }

        if(interaction.isButton()) {
            try {
                const data = interaction.customId.split(';');
                const buttonActions = data[0];

                const btnAction = interaction.client.interactions.get(buttonActions);
                if(!btnAction) { return; }

                await btnAction.execute(interaction);
            } catch(error) {
                console.error('event:interactionCreate |',error.message);
            }
        }
    }
};