const ms = require('milsymbol');

module.exports.newMarker = (uid, feature) => {
  let eventType = feature.type;
  et = eventType.split("-");
  let affil = et[1];

  if (affil.includes(".")) {
    affil = "n";
  }

  let SIDC = `s${affil}${et[2]}p${et[3] || "-" }${et[4] || "-" }${et[5] || "-" }${et[6] || "-" }-------`;
  callsign = (feature.callsign != '@@@@@@@@') ? feature.callsign : "not set";
  lat = feature.point.lat;
  lon = feature.point.lon;
  course = (feature.hasOwnProperty('track')) ? (feature.track.hasOwnProperty('course')) ? feature.track.course : undefined : undefined;
  speed = (feature.hasOwnProperty('track')) ? (feature.track.hasOwnProperty('speed')) ? Math.round(feature.track.speed) +"kn" : undefined : undefined;
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
        altitudeDepth: altft + "ft",
        additionalInformation: squawk,
        direction: course,
        speed: speed
      }, {
        infoBackground: bg,
        infoColor: fg
      })
  } else {
    var mysymbol = new ms.Symbol(
      SIDC, {
        uniqueDesignation: callsign,
        direction: course
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
