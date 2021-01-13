const http = require('http');
const port = 3000;
const handlers = require('./handlers');

http.createServer((req, res) => {
    // res.writeHead(200, {
    //     'Content-type': 'text/plain'
    // });

    for (let handler of handlers) {
        if (!handler(req, res)) {
            break;
        }
    }
    // res.write('Hello JS World');
    // res.end();

}).listen(port);