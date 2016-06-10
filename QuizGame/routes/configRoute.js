var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/general', function (req, res) {
    res.render('configGeneral', { config: config });
});

module.exports = router;