const util = require('util');
const express = require('express');
const net = require('net');
const helper = require('./lib/helper.js');

process.env.TZ = 'UTC';

require('./lib/tcpClient.js')
require('./lib/sslClient.js')

const app = express();

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

app.listen(3000, () => {
  console.log(`TAK-WEB-MAP server started`);
})
