var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');

var DocumentDBClient = require('documentdb').DocumentClient;
var RepositorioBase = require('./datos/repositoryBase.js');
var PartidaRepository = require('./datos/partidaRepository.js');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


var routes = require('./routes/index');
var users = require('./routes/users');
var pregunta = require('./routes/pregunta');
var partida = require('./routes/partida');
var perfil = require('./routes/perfil');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var repositoryBase = new RepositorioBase(docDbClient, config.databaseId, config.collectionId);
var partidaRepository = new PartidaRepository(repositoryBase);
repositoryBase.init();

app.use('/', routes);
app.use('/users', users);
app.use('/pregunta', pregunta);
app.use('/partida', partida);
app.use('/perfil', perfil);


passport.use(new FacebookStrategy({
                clientID: config.facebookAppId,
                clientSecret: config.facebookAppSecret,
                callbackURL: "http://localhost:1337/auth/facebook/callback" //TODO: Modificar url
            },
            function (accessToken, refreshToken, profile, done) {
                console.log(profile);

            }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
