var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/created', function(req, res, next){
  res.send('Account successfully created!');
});

module.exports = router;
