const url = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats');
const breeds = require('../data/breeds');


function getContentType(url) {

    if(url.endsWith('css')) {
        return 'text/css';
    } else if(url.endsWith('js')) {
        return 'text/javascript';
    } else if(url.endsWith('')) {
        return 'application/json';
    } else if(url.endsWith('png')) {
        return 'image/png';
    } else if(url.endsWith('jpg')) {
        return 'image/jpg';
    } else if(url.endsWith('wav')) {
        return 'audio/wav';
    } else if(url.endsWith('html')) {
        return'text/html';
    }
}

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content') && req.method === 'GET') {
        // let filePath = '';
        // filePath = path.normalize(
        //     path.join(pathname, '../views/home/index.html')
        // );

        fs.readFile(`./${pathname}`, 'utf-8', (err, data) => {
            if (err) {
                console.log(err);

                res.writeHead(404, {
                    "content-type": "text/plain"
                });

                res.write('addy not found');
                res.end();
                return;
            }

            console.log('static files.js (31) pathname is', pathname);
            res.writeHead(200, {
                "content-type": getContentType(pathname)
            });

            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
}