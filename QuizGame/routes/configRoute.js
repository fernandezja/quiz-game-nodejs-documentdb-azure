var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/general', function (req, res) {

    if (!res.locals.esAdmin) res.redirect(401, '/sinpermiso');

    res.render('configGeneral', { config: config });
});

module.exports = router;