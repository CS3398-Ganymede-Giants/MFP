var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(8080);

console.log('Server started');

// const express = require('express')
// const app = express()
// const port = 3000
// 
// app.get('/', (req, res) => res.send('Hello World!'))
// console.log("TEST")
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))