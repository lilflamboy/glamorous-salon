const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('SQLite connection error:', err.message);
    } else {
        console.log('✅ SQLite Connected Successfully');
    }
});

const dbWrapper = {
    query: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([rows]);
                    }
                });
            } else {
                db.run(sql, params, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
                    }
                });
            }
        });
    },
    getConnection: () => {
        return Promise.resolve({
            query: dbWrapper.query,
            release: () => {}, // No-op for SQLite
            catch: (fn) => {}
        });
    }
};

module.exports = dbWrapper;
