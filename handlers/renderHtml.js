const fs = require('fs');
const path = require('path');

function getContentType(url) {
    const extensionMap = {
        '.css': 'text/css',
        '.html': 'text/html; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.ico': 'image/ico'
    }

    const ext = extensionMap[path.extname(url)];

    if (ext) {
        return ext;
    } else {
        return true;
    }
}
module.exports = (filePath, res) => {
    fs.readFile(filePath, (err, data) => {
        
        if (err) {
            console.log(err);

            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.write('Page not found!');
            res.end();
            return;
        }

        res.writeHead(200, {
            'Content-Type': getContentType(filePath)
        })
        res.write(data);
        res.end();
    })
}