require('dotenv').config();
const db = require('./db');

async function checkUsers() {
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE role = 'admin' OR email = 'admin' OR email = 'admin@glamoroussalon.com'");
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}
checkUsers();
