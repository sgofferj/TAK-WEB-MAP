const util = require('util');
var $ = require("jquery");
require('bootstrap');
var L = require('leaflet');
require('leaflet-fullscreen');
require('leaflet.locatecontrol');
require('leaflet-providers');
const functions = require('./functions.js');

var markersCurrent = [];

var map = L.map('map', {
  fullscreenControl: true
});

L.control.locate().addTo(map);

// Set the position and zoom level of the map
map.setView([47.70, 13.35], 7);

var osm = L.tileLayer.provider('OpenStreetMap.Mapnik', {
  noWrap: true,
});

var otm = L.tileLayer.provider('OpenTopoMap', {
  noWrap: true,
});

var mmltausta = L.tileLayer.wms('https://tiles.kartat.kapsi.fi/taustakartta?', {
  noWrap: true,
  attribution: 'Map &copy; <a href="https://www.maanmittauslaitos.fi/en">National Land Survey of Finland</a>&nbsp;<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>',
  layers: 'taustakartta'
});

var mmltopo = L.tileLayer.wms('https://tiles.kartat.kapsi.fi/peruskartta?', {
  noWrap: true,
  attribution: 'Map &copy; <a href="https://www.maanmittauslaitos.fi/en">National Land Survey of Finland</a>&nbsp;<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>',
  layers: 'peruskartta'
});

var mmlaerial = L.tileLayer.wms('https://tiles.kartat.kapsi.fi/ortokuva?', {
  noWrap: true,
  attribution: 'Map &copy; <a href="https://www.maanmittauslaitos.fi/en">National Land Survey of Finland</a>&nbsp;<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>',
  layers: 'ortokuva'
});

var precip = new L.TileLayer('https://tilecache.rainviewer.com/v2/radar/' + parseInt(Date.now() / 600000) * 600 + '/256/{z}/{x}/{y}/2/1_1.png', {
  tileSize: 256,
  opacity: 0.4,
  transparent: true,
  attribution: '<a href="https://rainviewer.com" target="_blank">rainviewer.com</a>'
});



var basemaps = {
  "OpenStreetMap": osm,
  "OpenTopoMap": otm,
  "Finnish Land Survey Background": mmltausta,
  "Finnish Land Survey Topo": mmltopo,
  "Finnish Land Survey Aerial": mmlaerial,
};

var overlays = {
  "Precipitation": precip
}

L.control.layers(basemaps, overlays).addTo(map);

startMap = Object.keys(basemaps)[0];
basemaps[startMap].addTo(map);

function updateMarkers(markers) {
  for (var point in markers) {
    var uid = markers[point][0];
    var oldIndex = markersCurrent.findIndex(row => row.includes(uid));
    if ( oldIndex != -1 ) {                                                     // Point exists?
      lat = markers[point][1].point.lat;
      lon = markers[point][1].point.lon;
      olat = markersCurrent[oldIndex][1].point.lat;
      olon = markersCurrent[oldIndex][1].point.lon;
      if ( (lat != olat) || (lon != olon) ) {                                   // Point has changed position?
        $(".leaflet-marker-icon.marker-"+uid).remove();
        $(".leaflet-marker-shadow.marker-"+uid).remove();
        var marker = functions.newMarker(uid,markers[point][1]).addTo(map);
        marker._icon.classList.add("marker-" + markers[point][0]);
      }
    } else {                                                                    // Point does not yet exist
      var marker = functions.newMarker(uid,markers[point][1]).addTo(map);
      marker._icon.classList.add("marker-" + markers[point][0]);

    }
  }
  for (var point in markersCurrent) {                                           // Check local storage for objects that weren't in the last message any more
    var uid = markersCurrent[point][0];
    var newIndex = markers.findIndex(row => row.includes(uid));
    if (newIndex == -1) {
      $(".leaflet-marker-icon.marker-"+uid).remove();
      $(".leaflet-marker-shadow.marker-"+uid).remove();
    }
  }
}

var reloadJSON = setInterval(function() {
  fetch("/list")
    .then(function(response) {
      response.json().then(function(data) {
        updateMarkers(data);
        markersCurrent = data;
      });
    });
}, 1000);

function resizeMap() {
  var navHeight = $("#nav").outerHeight();
  var windowHeight = $(window).height();
  $("#map").height(windowHeight-navHeight);
}

$(document).ready(function(){
  resizeMap();
});

$(window).resize(function(){
  resizeMap();
});
