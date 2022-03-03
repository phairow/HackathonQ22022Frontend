var fs = require('fs'),
    http = require('http');

http.createServer(function (req, res) {
  console.log(req.url);
  let path = req.url.split('?')[0];
  let filename = path === '' || path === '/' ? '/index.html': path;

  fs.readFile(__dirname + filename, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(8080);