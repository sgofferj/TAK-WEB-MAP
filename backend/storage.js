var tls = require('tls'),
  fs = require('fs');

var options = {
  host: TAK_ADDR,
  port: TAK_PORT,
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  rejectUnauthorized: false
};

if (TAK_SSL == true) {
  var options = {
    host: TAK_ADDR,
    port: TAK_PORT,
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    rejectUnauthorized: false
  };
  conn = tls.connect(options, function() {
    if (!conn.authorized) console.log(conn.authorizationError);
    //conn.write(helper.helloPkg());
    console.log("SSL connected");
  });
} else {
  conn = net.createConnection(TAK_PORT,TAK_ADDR, function() {
    const hello = helper.helloPkg();
    conn.write(hello);
    console.log(hello);
  })
}

conn.on('data', function(data) {
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
});
