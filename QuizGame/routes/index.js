var express = require('express');
var passport = require('passport');
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


router.get('/loginFailure', function (req, res, next) {
    res.send('Failed to authenticate');
});


router.get('/auth/invitado', function (req, res, next) {
    res.send('oooo');
});



router.post('/auth/invitado',
    passport.authenticate('local', {
        successRedirect: '/main',
        failureRedirect: '/loginFailure',
        failureFlash: true
    })
);


module.exports = router;