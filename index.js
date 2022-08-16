const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const path = require('path');
const os = require("os")
const fs = require('fs');
const dns = require('dns');
const debug = require('debug')

app.use(express.static('public', { maxAge: '10m' }));

app.use('/static', express.static('public', { maxAge: '10m' }))

app.get('/', function(req, res) {

  console.log(req.url)

  // if (!req.headers['x-real-ip'].startsWith('10.')) {
  //   err = new Error("Oh NO! this application is failing with an informative NodeJs error message...")
  //   console.log(err)
  //   res.status(500).send()
  // } else {
    res.sendFile(path.join(__dirname, '/index.html'));
  // }
});

app.get('/headers', async (req, res) => {
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

app.get('/envs', (req, res) => {
  console.log(process.env);
  res.send('Envs displayed in logs!');
});

app.get('/cpus', (req, res) => {
  res.send(os.cpus());
});


app.get('/resolv', (req, res) => {
  try {
    const data = fs.readFileSync('/etc/resolv.conf', 'utf8');
    res.send(data);
  } catch (err) {
    console.error(err);
    res.send("resolv.conf not available");
  }
});

app.get('/dns', async(req, res) => {
  let ipAddress = await lookup("www.diarmuid.ie");
  res.send(ipAddress);
});

app.get('/traceroute', async(req, res) => {

});


const server = app.listen(PORT, () => {
  console.log(`Application is listening at port ${PORT}`);
});

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP app')
  server.close(() => {
    debug('HTTP app closed')
  })
});

process.on('SIGINT', () => {
  debug('SIGINT signal received: closing HTTP app')
  server.close(() => {
    debug('HTTP app closed')
  })
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
