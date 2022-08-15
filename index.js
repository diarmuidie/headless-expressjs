const express = require('express');
const server = express();
const PORT = 3300;
const path = require('path');
const os = require("os")
const fs = require('fs');
const dns = require('dns');

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


server.get('/resolv', (req, res) => {
  try {
    const data = fs.readFileSync('/etc/resolv.conf', 'utf8');
    res.send(data);
  } catch (err) {
    console.error(err);
    res.send("resolv.conf not available");
  }
});

server.get('/dns', async(req, res) => {
  let ipAddress = await lookup("www.diarmuid.ie");
  res.send(ipAddress);
});

server.get('/traceroute', async(req, res) => {

});


server.listen(PORT, () => {
  console.log(`Application is listening at port ${PORT}`);
});

function lookup(domain) {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err, address, family) => {
      if (err) {
        reject(err)
      } else {
        resolve({ address, family })
      }
    })
  })
}
