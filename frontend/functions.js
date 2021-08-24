const ms = require('milsymbol');

module.exports.newMarker = (uid, feature) => {
  let eventType = feature.type;
  et = eventType.split("-");
  let affil = et[1];

  if (affil.includes(".")) {
    affil = "n";
  }

  let SIDC = `s${affil}${et[2]}p${et[3] || "-" }${et[4] || "-" }${et[5] || "-" }${et[6] || "-" }-------`;
  callsign = feature.callsign;
  lat = feature.point.lat;
  lon = feature.point.lon;
  altm = parseInt(feature.point.hae);
  altft = Math.round(altm * 3.28084);
  remarks = feature.remarks;
  if (uid.indexOf('ICAO') != -1) {
    sIndex = remarks.indexOf('Squawk');
    if (sIndex != -1) squawk = remarks.substr(sIndex + 8, 4);
    else squawk = '';
    if ((squawk == '7500') || (squawk == '7600') || (squawk == '7700')) {
      bg = "red";
      fg = "yellow";
    } else {
      bg = "white";
      fg = "black";
    }
    var mysymbol = new ms.Symbol(
      SIDC, {
        uniqueDesignation: callsign,
        staffComments: altft + "ft",
        additionalInformation: squawk
      }, {
        infoBackground: bg,
        infoColor: fg
      })
  } else {
    var mysymbol = new ms.Symbol(
      SIDC, {
        uniqueDesignation: callsign
      }, {
        infoBackground: "white",
        infoColor: "black"
      })
  }

  mysymbol = mysymbol.setOptions({
    size: 25
  });

  var myicon = L.icon({
    iconUrl: mysymbol.toDataURL(),
    iconAnchor: [mysymbol.getAnchor().x, mysymbol.getAnchor().y],
  });

  return L.marker([lat, lon], {
    icon: myicon,
    draggable: false
  });
}
