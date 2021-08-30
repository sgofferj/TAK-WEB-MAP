const util = require('util');
const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const net = require('net');
const bodyParser = require('body-parser');

process.env.TZ = 'UTC';

require('./lib/tcpClient.js')
require('./lib/sslClient.js')

const app = express();
app.set('trust proxy', 'uniquelocal');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json()); // for parsing application/json
app.use('/', routes);
app.use(express.static(__dirname + "/../frontend"));


app.listen(3000, () => {
  console.log(`TAK-WEB-MAP server started`);
})
