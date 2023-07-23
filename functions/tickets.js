// Load required resources =================================================================================================
const path = require('path');
const SQLite = require('better-sqlite3');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');

// Load configuration files ================================================================================================
const { timezoneSv } = require(path.resolve('./config/bot'));

// Database ================================================================================================================
const sql = new SQLite(path.resolve('./data/db/tickets.sqlite'));

// Load custom functions ===================================================================================================
const helpers = require(path.resolve('./functions/helpers.js'));

// Internal Function =======================================================================================================
function getCurrentTimestamp() {
    dayjs.extend(timezone);
    dayjs.tz.setDefault(timezoneSv);
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

function genCatUID() {
    var newUID = helpers.uid(8);
    const query = sql.prepare(" SELECT count(*) as count FROM tickets_categories WHERE uid = ? ");
    if(query.get(newUID).count == 0) { return newUID; } else { return genCatUID(); }
}

// Functions Export ========================================================================================================
module.exports = {
    isTicket: (guildId, channelId) => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details WHERE guild = ? AND channel = ? ");
            return (query.get(guildId, channelId).count > 0);
        } catch(error) {
            console.error('[sqlite:isTicket]', error.message);
        }
    },

    countOpenTicketsByUser: (guildId, categoryId, userId) => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details WHERE user = ? AND guild = ? AND category = ? AND status = 'A' ");
            return query.get(userId, guildId, categoryId).count;
        } catch(error) {
            console.error('[sqlite:countOpenTicketsByUser]', error.message);
        }
    },

    generateTicketId: (guildId, categoryId) => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details WHERE guild = ? AND category = ? ");
            return parseInt(query.get(guildId, categoryId).count + 1).toString().padStart(5, '0');
        } catch(error) {
            console.error('[sqlite:generateTicketId]', error.message);
        }
    },

    createNewTicket: (ticket, guildId, categoryId, channelId, userId) => {
        try {
            const query = sql.prepare(" INSERT INTO tickets_details (ticket, guild, category, channel, user, timestamp_creation) VALUES (@i, @g, @c, @x, @u, @t); ");
            query.run({ i: ticket, g: guildId, c: categoryId, x: channelId, u: userId, t: getCurrentTimestamp() });
        } catch(error) {
            console.error('[sqlite:createNewTicket]', error.message);
        }
    },

    getDataFromTicket: (guildId, channelId) => {
        try {
            const query = sql.prepare(" SELECT ticket, user, category FROM tickets_details WHERE guild = ? AND channel = ? ");
            const data = query.get(guildId, channelId);
            return {
                ticket: data.ticket,
                user: data.user.toString(),
                category: data.category.toString()
            };
        } catch(error) {
            console.error('[sqlite:getDataFromTicket]', error.message);
        }
    },

    updateStatus: (guildId, channelId, newStatus) => {
        try {
            switch(newStatus) {
                default:
                case 'open':    var status = 'A'; var timestamp = null; break;
                case 'closed':  var status = 'C'; var timestamp = null; break;
                case 'deleted': var status = 'D'; var timestamp = getCurrentTimestamp(); break;
            }

            const query = sql.prepare(" UPDATE tickets_details SET status = @sts, timestamp_deletion = @tms WHERE guild = @gld AND channel = @chn; ");
            query.run({ gld: guildId, chn: channelId, sts: status, tms: timestamp });
        } catch(error) {
            console.error('[sqlite:updateStatus]', error.message);
        }
    },

    getTicketsMemberLeft: (guildId, userId) => {
        try {
            const query = sql.prepare(" SELECT category, channel FROM tickets_details WHERE guild = @gld AND user = @usr AND status != 'D'; ");
            return query.all({ gld: guildId, usr: userId });
        } catch(error) {
            console.error('[sqlite:getTicketsMemberLeft]', error.message);
        }
    },

    listCategories: () => {
        try {
            const query = sql.prepare(" SELECT * FROM tickets_categories ");
            return query.all();
        } catch(error) {
            console.error('[sqlite:listCategories]', error.message);
        }
    },

    createNewCategory: (name, category, emoji, description, limit) => {
        try {
            const query = sql.prepare(" INSERT INTO tickets_categories (uid, name, category, emoji, description, limit_tickets) VALUES (@u, @n, @c, @e, @d, @l); ");
            query.run({ u: genCatUID(), n: name, c: category, e: emoji, d: description, l: limit });
        } catch(error) {
            console.error('[sqlite:createNewCategory]', error.message);
        }
    },

    readCategory: (uid) => {
        try {
            const query = sql.prepare(" SELECT * FROM tickets_categories WHERE uid = ? ");
            return query.get(uid);
        } catch(error) {
            console.error('[sqlite:readCategory]', error.message);
        }
    },

    updateCategory: (uid, name, description, limit) => {
        try {
            const query = sql.prepare(" UPDATE tickets_categories SET name = @n, description = @d, limit_tickets = @l WHERE uid = @u; ");
            query.run({ n: name, d: description, l: limit, u: uid });
        } catch(error) {
            console.error('[sqlite:updateCategory]', error.message);
        }
    },

    deleteCategory: (uid) => {
        try {
            const query = sql.prepare(" DELETE FROM tickets_categories WHERE uid = @uid; ");
            query.run({ uid: uid });
        } catch(error) {
            console.error('[sqlite:deleteCategory]', error.message);
        }
    },

    countTicketsOnCategory: (uid) => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details WHERE category = ? AND status != 'D' ");
            return query.get(uid).count;
        } catch(error) {
            console.error('[sqlite:countTicketsOnCategory]', error.message);
        }
    },

    // Stats
    countTotalCategories: () => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_categories ");
            return query.get().count;
        } catch(error) {
            console.error('[sqlite:countTotalCategories]', error.message);
        }
    },

    countTotalTicketsGlobal: () => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details ");
            return query.get().count;
        } catch(error) {
            console.error('[sqlite:countTotalTicketsGlobal]', error.message);
        }
    },

    countTotalTicketsOpen: () => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details WHERE status = 'A' ");
            return query.get().count;
        } catch(error) {
            console.error('[sqlite:countTotalTicketsOpen]', error.message);
        }
    },

    countTotalTicketsClosed: () => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details WHERE status = 'C' ");
            return query.get().count;
        } catch(error) {
            console.error('[sqlite:countTotalTicketsClosed]', error.message);
        }
    },

    countTotalTicketsDeleted: () => {
        try {
            const query = sql.prepare(" SELECT count(*) as count FROM tickets_details WHERE status = 'D' ");
            return query.get().count;
        } catch(error) {
            console.error('[sqlite:countTotalTicketsDeleted]', error.message);
        }
    },

};
