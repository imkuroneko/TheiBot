// Load required resources =================================================================================================
const { Events, ActivityType } = require('discord.js');
const path = require('path');
const fs = require('fs');

// Module script ===========================================================================================================
module.exports = {
    name: Events.ClientReady,
    execute(client) {
        // Crons
        try {
            const cronsFiles = fs.readdirSync(path.resolve('./crons')).filter(file => file.endsWith('.js'));
            if(cronsFiles.length) {
                for(file of cronsFiles) {
                    const cron = require(path.resolve(`./crons/${file}`))(client);
                    cron.start();
                }
            }
        } catch(error) {
            console.error('[event:cron:ready]', error.message);
        }
    }
};
