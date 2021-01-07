const http = require('http');
const port = 3000;

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-type': 'text/plain'
    });

    res.write('Hello JS World');
    res.end();

}).listen(port);