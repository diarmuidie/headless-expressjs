const express = require('express');
const server = express();
const PORT = process.env.PORT || 3300;
const path = require('path');
const os = require("os")

server.use(express.static('public', { maxAge: '10m' }));

server.use('/static', express.static('public', { maxAge: '10m' }))

server.get('/', function(req, res) {

  console.log(req.url)

  // if (!req.headers['x-real-ip'].startsWith('10.')) {
  //   err = new Error("Oh NO! this application is failing with an informative NodeJs error message...")
  //   console.log(err)
  //   res.status(500).send()
  // } else {
    res.sendFile(path.join(__dirname, '/index.html'));
  // }
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

server.get('/cpus', (req, res) => {
  res.send(os.cpus());
});

server.listen(PORT, () => {
  console.log(`Application is listening at port ${PORT}`);
});
