const NodeCache = require("node-cache");
const objectCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 10
});
const {cot} = require("@vidterra/tak.js")
const helper = require('./helper.js');

module.exports.store = (data) => {
  try {
    const result = helper.findCotTcp(data);
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
      ttl = helper.findCotTtl(obj.start, obj.stale);
      success = objectCache.set(uid, obj, ttl);
    }
  } catch (e) {
    console.error('error', e, data.toString());
  }
}

module.exports.getAll = () => {
  var points = [];
  list = objectCache.keys();
  cache = objectCache.mget(list);
  for (const [uid, cot] of Object.entries(cache)) {
    points.push([uid, cot]);
  }
  return points;
}
