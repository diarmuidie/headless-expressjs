const express = require('express');
const server = express();
// const PORT = process.env.PORT || 3300;
const PORT = 3456
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
      'headers': req.headers
    },
    'host': req.hostname,
    'check': req.hostname?.indexOf('diarmuid.141.193.213.11.sslip.io') === 0
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
