// Load required resources =================================================================================================
const path = require('path');

// Load configuration files ================================================================================================
const { ownerId } = require(path.resolve('./config/bot'));

// Module script ===========================================================================================================
exports.run = async (client, message, args) => {
    try {
        if(message.author.id != ownerId) { return; }

        await message.reply('🦄 Reiniciando bot~');
        process.exit(0);
    } catch(error) {
        message.reply('`[cmdPrefix:restartbot]` error: '+error.message);
        console.error('[cmdPrefix:restartbot]', error.message);
    }
}