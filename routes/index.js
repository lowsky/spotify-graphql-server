var express = require('express');
var packageJson = require('../package.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Spotify Graphql Server', version: packageJson.version });
});

module.exports = router;
