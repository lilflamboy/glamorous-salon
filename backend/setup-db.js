const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

async function setup() {
    const passwords = ['', 'root', 'admin123', 'admin', 'password', '12345678'];
    let connected = false;

    console.log("Attempting to connect to MySQL...");

    for (const password of passwords) {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: password,
                port: parseInt(process.env.DB_PORT) || 3306
            });

            console.log(`✅ Successfully connected with password: "${password}"`);
            
            // Update .env with working password
            const fs = require('fs');
            const path = require('path');
            const envPath = path.join(__dirname, '../backend/.env');
            let envContent = fs.readFileSync(envPath, 'utf8');
            envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
            fs.writeFileSync(envPath, envContent);
            console.log("✅ Updated backend/.env with the working password.");

            // Create database
            const dbName = process.env.DB_NAME || 'glamorous_salon';
            await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
            console.log(`✅ Database "${dbName}" ensured (created or already exists).`);
            
            await connection.end();
            connected = true;
            break;
        } catch (err) {
            console.log(`❌ Failed with password: "${password}" - ${err.message}`);
        }
    }

    if (!connected) {
        console.log("\n⚠️ Could not connect with common passwords. Please check if MySQL service is running.");
    }
}

setup();
