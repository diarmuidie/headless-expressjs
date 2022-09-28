const os = require("os")
const childProcess = require("child_process")
const fs = require('fs');

// console.log("====== cache-folder check ======")
// try {
//   const data = fs.readFileSync('.nuxt/cached', 'utf8');
//   console.log(data);
// } catch (err) {
//   console.error(err);
// }

// console.log("====== cache-folder save ======")
// try {
//   fs.mkdirSync(".nuxt");
// } catch (err) {
//   console.error(err);
// }
// try {
//   fs.writeFileSync(".nuxt/cached", "unique");
// } catch (err) {
//   console.error(err);
// }

// try {
//   fs.writeFileSync("test", "unique");
// } catch (err) {
//   console.error(err);
// }

// console.log("====== cache-folder validate ======")
// try {
//   const data = fs.readFileSync('.nuxt/cached', 'utf8');
//   console.log(data);
// } catch (err) {
//   console.error(err);
// }

console.log("====== process.env ======")
console.log(process.env)

console.log("====== os.cpus ======")
console.log(os.cpus())

console.log("====== /proc/cpuinfo ======")
try {
  const data = fs.readFileSync('/proc/cpuinfo', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}

console.log("====== /proc/stat ======")
try {
  const data = fs.readFileSync('/proc/stat', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}

console.log("====== lscpu -p ======")
console.log(childProcess.execSync(`lscpu -p`, { encoding: `utf8` }));

console.log("====== nproc ======")
console.log(childProcess.execSync(`nproc`, { encoding: `utf8` }));
