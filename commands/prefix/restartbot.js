const { ownerId } = require('../../config/bot.json');

exports.run = (client, message, args) => {
    try {
        if(message.author.id != ownerId) {
            message.reply("🚨 **no tienes permiso para ejecutar este comando!**");
        }

        message.reply('🦄 Reiniciando bot~');

        process.exit();

    } catch (error) {
        console.error('[error] cmdPrefix:restartbot |',error.message);
    }
}