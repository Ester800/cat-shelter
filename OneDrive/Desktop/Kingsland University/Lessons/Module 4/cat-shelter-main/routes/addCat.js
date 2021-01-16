var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('add-cat', { title: 'Add cat form' });
});

module.exports = router;