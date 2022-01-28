const path = require('path');
module.exports = {
    resolve: {
        alias: {
            '@scheduler': path.resolve(__dirname, './scheduler/src/'),
            '@object-observer': path.resolve(__dirname, './object-observer/src/'),
            '@simler-core':path.resolve(__dirname,'./simler-core/src/')
        },
        extensions: ['.ts','.tsx','.d.ts', '...'],
    }
}