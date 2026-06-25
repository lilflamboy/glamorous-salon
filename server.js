const path = require('path');

// Change working directory to backend so server.js can find its dependencies and .env
process.chdir(path.join(__dirname, 'backend'));

// Load the actual server using path relative to root
require('./backend/server.js');
