const ms = require('milsymbol');

module.exports.newMarker = (feature) => {
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
  var mysymbol = new ms.Symbol(
    SIDC, {
      uniqueDesignation: callsign
    })
  // Now that we have a symbol we can ask for the echelon and set the symbol size
  mysymbol = mysymbol.setOptions({
    size: 30
  });

  var myicon = L.icon({
    iconUrl: mysymbol.toDataURL(),
    iconAnchor: [mysymbol.getAnchor().x, mysymbol.getAnchor().y],
  });

  return L.marker([lat,lon], {
    icon: myicon,
    draggable: false
  });
}
