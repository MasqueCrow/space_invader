const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080; // Choose any available port

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading the file');
        } else {
            if (req.url.endsWith('.css')) {
                res.writeHead(200, { 'Content-Type': 'text/css' });
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
            }
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
