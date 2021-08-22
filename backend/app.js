const util = require('util');
const express = require('express');
const app = express();
const port = 3000;
const NodeCache = require( "node-cache" );
const objectCache = new NodeCache({ stdTTL: 60, checkperiod: 10 });
const { cot } = require('@vidterra/tak.js');
const helper = require('./helper.js');

app.use(express.static(__dirname+"/../frontend"));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname+"/../frontend" });
})

app.get('/list', (req, res) => {
  let points = '{';
  list = objectCache.keys();
  for (const key of list) {
    point = objectCache.get(key);
    console.log(point);
    points += "'"+key+"':"+util.inspect(point)+",";
  }
  points = points.slice(0, -1);
  points += '}';
  res.setHeader('Content-Type', 'application/json');
  res.send(points);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

var tls = require('tls'),
    fs = require('fs');

var options = {
  host: "192.168.10.201",
  port: 8089,
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  rejectUnauthorized: false
};

var conn = tls.connect(options, function() {
  if (conn.authorized) {
    console.log("Connection authorized by a Certificate Authority.");
  } else {
    console.log("Connection not authorized: " + conn.authorizationError);
  }
    console.log();
});

conn.on('data', function (data) {
  try {
    const result = helper.findCotTcp(data);
    for (const message of result) {

      msg = cot.xml2js(message);
      uid = msg.event._attributes.uid;
      type = msg.event._attributes.type;
      start = msg.event._attributes.start;
      stale = msg.event._attributes.stale;
      callsign = msg.event.detail.contact._attributes.callsign;
      point = msg.event.point._attributes;
      if (msg.event.detail.hasOwnProperty('remarks')) remarks = msg.event.detail.remarks._text;
      else remarks="";

      obj = {
        "uid":uid,
        "type":type,
        "callsign":callsign,
        "start":start,
        "stale":stale,
        "point":point,
        "remarks":remarks
      }

      ttl = helper.findCotTtl(obj.start,obj.stale);
      success = objectCache.set(uid,obj,ttl);
      console.log(uid+" "+ttl+"s "+success);
      console.log('---------------------------------------------------------');
    }
  } catch(e) {
    console.error('error', e, data.toString());
  }
});
