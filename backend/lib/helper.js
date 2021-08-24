const {cot, proto} = require('@vidterra/tak.js')
const os = require('os')
const NodeCache = require("node-cache");
const objectCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 10
});

module.exports.helloPkg = () => {
  const dt = Date.now();
  const dtD = new Date(dt).toISOString();
  const dtD5 = new Date(dt + 250000).toISOString();
  const pkg = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><event version="2.0" type="t-x-d-d" uid="tak-web-map" time="'+dtD+'" start="'+dtD+'" stale="'+dtD5+'" how="m-g"/>';
  return pkg;
}

module.exports.failExit = (msg) => {
  console.log(msg);
  process.exit(1);
}

module.exports.cLog = (req) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log('{"Timestamp":"' + Date.now() + '","IP":"' + ip + '","Method":"' + req.method + '","URL":"' + req.url + '","Result":"200"},"Parameters":[' + JSON.stringify(req.body) + ']');
}

module.exports.findCotTcp = (raw) => {
	const stringData = raw.toString()
	return stringData.match(/<event.*?<\/event>/g) // split incoming data into individual COT messages
}

module.exports.findCotTtl = (startDate,staleDate) => {
	const ttl = (Date.parse(staleDate) - Date.parse(startDate)) / 1000;
	return ttl;
}

module.exports.handleData = (data) => {
  try {
    const result = this.findCotTcp(data);
    for (const message of result) {
      msg = cot.xml2js(message);
      console.log(msg);
      uid = msg.event._attributes.uid;
      type = msg.event._attributes.type;
      start = msg.event._attributes.start;
      stale = msg.event._attributes.stale;
      callsign = msg.event.detail.contact._attributes.callsign;
      point = msg.event.point._attributes;
      if (msg.event.detail.hasOwnProperty('remarks')) {
        remarks = msg.event.detail.remarks._text;
      } else remarks = "";
      obj = {
        "type": type,
        "callsign": callsign,
        "start": start,
        "stale": stale,
        "point": point,
        "remarks": remarks
      }
      ttl = this.findCotTtl(obj.start, obj.stale);
      success = objectCache.set(uid, obj, ttl);
    }
  } catch (e) {
    console.error('error', e, data.toString());
  }
}

module.exports.getObjectList = () => {
  var points = [];
  list = objectCache.keys();
  cache = objectCache.mget(list);
  for (const [uid, cot] of Object.entries(cache)) {
    points.push([uid, cot]);
  }
  return points;
}
