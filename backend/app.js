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
  var points = [];
  list = objectCache.keys();
  cache = objectCache.mget(list);
  for (const [uid, cot] of Object.entries(cache)) {
    points.push([uid,cot]);
  }
  console.log('{"Timestamp":"' + Date.now() + '","IP":"' + req.ip + '","Method":"' + req.method + '","URL":"' + req.url + '","Result":"300","Parameters":[' + JSON.stringify(req.body) + ']}');
  res.setHeader('Content-Type', 'application/json');
  res.send(points);
})

app.get('/test', (req, res) => {
  var points = [];
  list = objectCache.keys();
  cache = objectCache.mget(list);
  for (const [uid, cot] of Object.entries(cache)) {
    points.push([uid,cot]);
  }
  console.log('{"Timestamp":"' + Date.now() + '","IP":"' + req.ip + '","Method":"' + req.method + '","URL":"' + req.url + '","Result":"300","Parameters":[' + JSON.stringify(req.body) + ']}');

  points.forEach((point) => {
    console.log (point[0]);
  });
  res.send(points);

})

app.listen(port, () => {
  console.log(`Started`);
})

var tls = require('tls'),
    fs = require('fs');

var options = {
  host: "tak.gofferje.net",
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
        "type":type,
        "callsign":callsign,
        "start":start,
        "stale":stale,
        "point":point,
        "remarks":remarks
      }
      console.log(util.inspect(obj));
      ttl = helper.findCotTtl(obj.start,obj.stale);
      success = objectCache.set(uid,obj,ttl);
    }
  } catch(e) {
    console.error('error', e, data.toString());
  }
});
