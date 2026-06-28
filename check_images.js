const https = require('https');

const urls = [
    'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&fit=crop',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&fit=crop',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&fit=crop',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&fit=crop',
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&fit=crop',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&fit=crop',
    'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=600&fit=crop',
    'https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&fit=crop',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&fit=crop',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&fit=crop',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&fit=crop',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?w=600&fit=crop',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&fit=crop',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&fit=crop'
];

async function checkUrls() {
    for (let url of urls) {
        await new Promise(resolve => {
            https.get(url, (res) => {
                console.log(`${res.statusCode} - ${url}`);
                resolve();
            }).on('error', (e) => {
                console.error(`Error - ${url}`);
                resolve();
            });
        });
    }
}

checkUrls();
