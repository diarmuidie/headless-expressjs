const express = require('express');
const server = express();
const PORT = process.env.PORT || 3300;
const path = require('path');

server.use(express.static('public'));

server.use('/static', express.static('public'))

server.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

server.get('/headers', async (req, res) => {
  console.log('Request: ' + req.headers['x-envoy-decorator-operation']);
  var body = {
    'status': 'OK',
    'request': {
      'h,eaders': req.headers
    },
    'host': req.hostname
  }
  res.send(JSON.stringify(body, null, 4));
});

server.get('/envs', (req, res) => {
  console.log(process.env);
  res.send('Envs displayed in logs!');
});

server.listen(PORT, () => {
  console.log(`Application is listening at port ${PORT}`);
});
