module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if(interaction.isChatInputCommand()) {
            try {
                const command = interaction.client.commandsSlash.get(interaction.commandName);
                if(!command) { return; }

                await command.execute(interaction);
            } catch(error) {
                console.error('[error] event:interactionCreate |',error.message);
                return interaction.reply({ content: 'oops! hubo un error al ejecutar el comando 😣', ephemeral: true });
            }
        }

        if(interaction.isButton()) {
            try {
                data = interaction.customId.split(';');
                buttonActions = data[0];

                const btnAction = interaction.client.interactions.get(buttonActions);
                if(!btnAction) { return; }

                await btnAction.execute(interaction);
            } catch(error) {
                console.error('[error] event:interactionCreate |',error.message);
            }
        }
    }
};



// v1
// module.exports = {
//     name: 'interactionCreate',
//     async execute(interaction) {

//         if(!interaction.isChatInputCommand()) { return; }

//         const command = interaction.client.commandsSlash.get(interaction.commandName);

//         if(!command) { return; }

//         try {
//             await command.execute(interaction);
//         } catch(error) {
//             console.error('interactionCreate :: '+error.message);
//             return interaction.reply({ content: 'oops! hubo un error al ejecutar el comando 😣', ephemeral: true });
//         }
//     }
// };
