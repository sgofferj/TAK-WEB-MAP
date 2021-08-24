const util = require('util');
const express = require('express');
const net = require('net');
const app = express();
const helper = require('./lib/helper.js');

process.env.TZ = 'UTC';

console.log(helper.helloPkg());
//process.exit(0);

require('./lib/tcpClient.js')
require('./lib/sslClient.js')

var conn;

// Mandatory ENVVARS
if (!("TAK_ADDR" in process.env)) helper.failExit('Missing TAK_ADDR');

// ENVVARS
const PORT = process.env.PORT || 3000;
const TAK_PORT = process.env.TAK_PORT || 8087;
const TAK_SSL = process.env.TAK_SSL || false;
const TAK_ADDR = process.env.TAK_ADDR;

app.use(express.static(__dirname + "/../frontend"));

app.get('/', (req, res) => {
  helper.cLog(req);
  res.sendFile('index.html', {
    root: __dirname + "/../frontend"
  });
})

app.get('/list', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  points = helper.getObjectList();
  res.send(points);
  helper.cLog(req);
})

app.listen(PORT, () => {
  console.log(`Started`);
})
