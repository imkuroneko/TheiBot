// Load required resources =================================================================================================
const path = require('path');

// Load configuration files ================================================================================================
const { ownerId } = require(path.resolve('./config/bot.json'));

// Module script ===========================================================================================================
exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) {
            return message.reply("🚨 **no tienes permiso para ejecutar este comando!**");
        }

        message.reply('🦄 Reiniciando bot');

        setTimeout(() => {
            process.exit();
        }, 2500);
    } catch(error) {
        console.error('cmdPrefix:restartbot |',error.message);
    }
}