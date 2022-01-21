const path = require('path');
module.exports = {
    resolve: {
        alias: {
            '@scheduler': path.resolve(__dirname, './scheduler/'),
            '@object-observer': path.resolve(__dirname, './object-observer/'),
        }
    }
}