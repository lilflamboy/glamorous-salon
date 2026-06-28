const db = require('./db');

async function fixImages() {
    try {
        await db.query(
            "UPDATE services SET image = 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&fit=crop' WHERE image = 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=600&fit=crop'"
        );
        console.log("Updated Pedicure image.");

        await db.query(
            "UPDATE services SET image = 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&fit=crop' WHERE image = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?w=600&fit=crop'"
        );
        console.log("Updated Silver Package image.");
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixImages();
