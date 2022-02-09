const config = require('../config/bot.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        // 🚨 Ignore bots
        if(message.author.bot) { return; }

        // 🦄 Legacy content from v0.2 =======================================================================
        if(!message.content.indexOf(config.prefix) <= 0) {
            nuggots_ = ['nugget', 'nuggot', 'nyuggot', 'nuggat'];
            for(let index = 0; index < nuggots_.length; index++) {
                if(message.content.toLowerCase().includes(nuggots_[index])) {
                    message.reply("Gimme nuggots! <:nuggots:864676232737718292>");
                }
            }

            thei_ = ['thei', 'theei', 'theii'];
            for(let index = 0; index < thei_.length; index++) {
                if(message.content.toLowerCase().includes(thei_[index])) {
                    message.reply("How you dare you hooman to summon me! <:theiFaka:925597678086283294>");
                }
            }
        }
        // ==================================================================================================

        // 🚨 Ignore when not prefix
        if(message.content.indexOf(config.prefix) !== 0) {
            return;
        }


        // 🥞 Split content
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // 🔍 Search command
        const cmd = message.client.commandsPrefix.get(command);

        if(!cmd) { return; }

        cmd.run(message.client, message, args);

    }
}