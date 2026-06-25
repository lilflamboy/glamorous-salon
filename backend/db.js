const path = require('path');
const fs = require('fs');

let db = null;
let dbReady = null;

async function initDb() {
    if (db) return db;

    // sql.js must be initialized asynchronously (loads WebAssembly)
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();

    const dbPath = process.env.VERCEL ? null : path.join(__dirname, 'database.sqlite');

    if (dbPath && fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database(); // fresh in-memory DB
    }

    console.log('✅ SQLite Connected Successfully');
    return db;
}

// Ensure DB is only initialized once
function getDb() {
    if (!dbReady) {
        dbReady = initDb();
    }
    return dbReady;
}

const dbWrapper = {
    query: async (sql, params = []) => {
        const database = await getDb();
        const upperSql = sql.trim().toUpperCase();

        if (upperSql.startsWith('SELECT')) {
            const stmt = database.prepare(sql);
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            return [rows];
        } else {
            database.run(sql, params);
            const lastIdResult = database.exec('SELECT last_insert_rowid() as id');
            const changesResult = database.exec('SELECT changes() as c');
            const insertId = lastIdResult[0] ? lastIdResult[0].values[0][0] : 0;
            const affectedRows = changesResult[0] ? changesResult[0].values[0][0] : 0;
            return [{ insertId, affectedRows }];
        }
    },
    getConnection: async () => {
        await getDb(); // ensure initialized
        return {
            query: dbWrapper.query,
            release: () => {},
            catch: (fn) => {}
        };
    }
};

module.exports = dbWrapper;
