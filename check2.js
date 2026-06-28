const https = require('https');
const urls = [
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&fit=crop'
];
urls.forEach(url => {
    https.get(url, res => {
        console.log(res.statusCode, url);
    });
});
