const path = require('path');
const fs = require('fs');

// Use sql.js (pure JS SQLite) — works on Vercel and all platforms without native binaries
let db = null;
let SQL = null;

function getDb() {
    if (db) return db;

    SQL = require('sql.js');
    // sql.js is promise-based in some versions; use sync API
    const initSqlJs = SQL;

    // Load existing DB file if it exists (local dev only), else create fresh in-memory DB
    const dbPath = process.env.VERCEL ? null : path.join(__dirname, 'database.sqlite');

    if (dbPath && fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database(); // In-memory
    }

    return db;
}

// Simple sync wrapper that mimics the async interface used by server.js
const dbWrapper = {
    query: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            try {
                const database = getDb();
                const upperSql = sql.trim().toUpperCase();

                if (upperSql.startsWith('SELECT')) {
                    const stmt = database.prepare(sql);
                    stmt.bind(params);
                    const rows = [];
                    while (stmt.step()) {
                        rows.push(stmt.getAsObject());
                    }
                    stmt.free();
                    resolve([rows]);
                } else {
                    database.run(sql, params);
                    // Get last insert id
                    const lastId = database.exec('SELECT last_insert_rowid() as id');
                    const insertId = lastId[0] ? lastId[0].values[0][0] : 0;
                    const changes = database.exec('SELECT changes() as c');
                    const affectedRows = changes[0] ? changes[0].values[0][0] : 0;
                    resolve([{ insertId, affectedRows }]);
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    getConnection: () => {
        return Promise.resolve({
            query: dbWrapper.query,
            release: () => {},
            catch: (fn) => {}
        });
    }
};

module.exports = dbWrapper;
