const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;
const path = require('path');
const os = require("os")
const fs = require('fs');
const dns = require('dns');
const debug = require('debug')

app.use(express.static('public', { maxAge: '10m' }));
app.use('/_next/image', require('./routes/next-image'));

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

app.get('/500', function(req, res) {
  res.status(500).send('500 FIRE!');
});

app.get('/error', function(req, res) {
  res.status(500).send('Error FIRE!');
});

app.get('/404', function(req, res) {
  res.status(404).send('This is not the page you are looking for');
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

app.get('/cached', (req, res) => {
  res.set('Cache-control', 'public, max-age=300')
  res.send("Cached!");
});

app.get('/envs', (req, res) => {
  res.send(process.env);
});

app.get('/cpus', (req, res) => {
  res.send(os.cpus());
});

app.get('/cpuinfo', (req, res) => {
  res.sendFile("proc/cpuinfo");
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

app.get('/timeout/:duration(\\d+)', async(req, res) => {
  const duration = req.params['duration']
  console.log("Sleep start", duration)
  await sleepsec(duration)
  console.log("Sleep end")
  res.send("Slept for " + duration);
});

app.get('/vary', (req, res) => {
  const rsc = req.headers['rsc']
  res.set('Cache-control', 'public, max-age=30')

  if (rsc !== undefined) {
    res.set('x-atlas-vary-key', "RSC:"+rsc)
  }
  res.vary('RSC').send("Varied on 'RSC=" + rsc + "'");
});

app.get('/device-type', (req, res) => {
  res.set('Cache-control', 'public, max-age=60')
  res.send("Atlas-Device-Type = '" + req.headers['atlas-device-type'] + "' CF-Device-Type = '" + req.headers['cf-device-type'] + "'");
});

app.get('/device-type-rsc', (req, res) => {
  res.set('Cache-control', 'public, max-age=60')
  res.vary('RSC, Atlas-Device-Type').send("RSC = '" + req.headers['rsc'] + "' Atlas-Device-Type = '" + req.headers['atlas-device-type'] + "' CF-Device-Type = '" + req.headers['cf-device-type'] + "'");
});

const server = app.listen(PORT, () => {
  console.log(`Application is listening on port ${PORT}`);
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

function sleepsec(s) {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });
}
