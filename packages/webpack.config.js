const path = require('path');
module.exports = {
    resolve: {
        alias: {
            '@scheduler': path.resolve(__dirname, './scheduler/src/'),
            '@observer': path.resolve(__dirname, './observer/src/'),
            '@simler-core':path.resolve(__dirname,'./simler-core/src/')
        },
        extensions: ['.ts','.tsx','.d.ts', '...'],
    }
}