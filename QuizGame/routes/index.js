var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('home', { title: 'QuizGame'});
});

router.get('/main', function (req, res) {
    
    var mainVm = {
        usuario: req.session.passport.user
    };

    res.render('index', mainVm);
});

module.exports = router;