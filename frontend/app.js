// Initialize leaflet.js
var L = require('leaflet');
require('leaflet-fullscreen');
require('leaflet.locatecontrol');

// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: false,
  fullscreenControl: true
});

L.control.locate().addTo(map);

// Set the position and zoom level of the map
map.setView([47.70, 13.35], 7);

// Initialize the base layer
var mmltopo = L.tileLayer.wms('https://tiles.kartat.kapsi.fi/peruskartta?', {
  noWrap: true,
  attribution: 'Map &copy; <a href="https://www.maanmittauslaitos.fi/en">National Land Survey of Finland</a>&nbsp;<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>',
  layers: 'peruskartta'
}).addTo(map);
