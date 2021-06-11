var http = require('http');
const port = process.env.PORT || 8080;

http.createServer(function (req, res) {
  console.log("Request:" . req.headers['x-envoy-decorator-operation']);

  var body = {
    'status': 'OK',
    'request': {
      'headers': req.headers
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body, null, 4));
}).listen(port, () => {
  console.log('Atlas canary listening on port: ', port);
});
