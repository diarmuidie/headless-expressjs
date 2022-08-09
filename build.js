const os = require("os")

console.log("building");

console.log(os.cpus())

const Traceroute = require('nodejs-traceroute');

try {
    const tracer = new Traceroute();
    tracer
        .on('destination', (destination) => {
            console.log(`destination: ${destination}`);
        })
        .on('hop', (hop) => {
            console.log(`hop: ${JSON.stringify(hop)}`);
        })
        .on('close', (code) => {
            console.log(`close: code ${code}`);
        });

    tracer.trace('diarmuid.wpengine.com');
} catch (ex) {
    console.log(ex);
}

try {
  const tracer = new Traceroute();
  tracer
      .on('destination', (destination) => {
          console.log(`destination: ${destination}`);
      })
      .on('hop', (hop) => {
          console.log(`hop: ${JSON.stringify(hop)}`);
      })
      .on('close', (code) => {
          console.log(`close: code ${code}`);
      });

  tracer.trace('diarmuid.wpenginepowered.com');
} catch (ex) {
  console.log(ex);
}
