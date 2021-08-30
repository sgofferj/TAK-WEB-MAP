const express = require('express');
const router = express.Router();
const fs = require('fs');
const helper = require('../lib/helper.js');
const objects = require('../lib/objectcache.js')

function capitalizeFirstLetter(str) {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
}

function cLog(req) {
  console.log('{"Timestamp":"' + Date.now() + '","IP":"' + req.ip + '","Method":"' + req.method + '","URL":"' + req.url + '","Result":"200"},"Parameters":[' + JSON.stringify(req.body) + ']');
}

router.get('/', (req, res) => {
  cLog(req);
  res.render('index', {
    name: "index",
    sitename: (typeof process.env.SITENAME !== 'undefined') ? 'build:' + process.env.SITENAME : 'TAK-WEB-MAP',
    version: (typeof process.env.VERSION !== 'undefined') ? 'build:' + process.env.VERSION : 'Development version'
  });
});

router.get('/list', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  points = objects.getAll();
  res.send(points);
  helper.cLog(req);
})

router.get('/health', (req, res) => {
  cLog(req);
  res.send('OK');
});

module.exports = router;
