var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');



var config = require('./config');

var DocumentDBClient = require('documentdb').DocumentClient;
var RepositorioBase = require('./datos/repositoryBase.js');
var PartidaRepository = require('./datos/partidaRepository.js');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
//login invitado
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var routes = require('./routes/index');
var users = require('./routes/users');
var pregunta = require('./routes/pregunta');
var partida = require('./routes/partida');
var perfil = require('./routes/perfil');

var preguntaApi = require('./routesApi/preguntaApi');
var rankingApi = require('./routesApi/rankingApi');
var perfilApi = require('./routesApi/perfilApi');
var partidaApi = require('./routesApi/partidaApi');

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
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var repositoryBase = new RepositorioBase(docDbClient, config.databaseId, config.collectionId);
var partidaRepository = new PartidaRepository(repositoryBase);
repositoryBase.init();


//facebook
passport.use(new FacebookStrategy({
    clientID: config.facebookAppId,
    clientSecret: config.facebookAppSecret,
    callbackURL: "http://localhost:1337/auth/facebook/callback", //TODO: Modificar url que tome la actual,
    profileFields: ['id', 'name', 'picture.type(large)', 'emails', 'displayName', 'about', 'gender'],
},
    function (accessToken, refreshToken, profile, cb) {

        return cb(null, profile);
    }
));


//Invitado 
passport.use(new LocalStrategy({
    profileFields: ['id',  'displayName'],
},
    function (username, password, cb) {
        process.nextTick(function () {
            var user = {
                id: 1,
                displayName: username
            };

            return cb(null, user);
        
    });
}));


passport.serializeUser(function (user, cb) {
    app.locals.usuarioNombreCompleto = user.displayName;

    if (user.photos) {
        app.locals.usuarioImagenUrl = user.photos[0].value;
    } else {
        app.locals.usuarioImagenUrl = '/imagenes/usuario-anonimo.png'; 
    }
    

    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


app.use(passport.initialize());
app.use(passport.session());



app.use('/', routes);
app.use('/users', users);
app.use('/pregunta', pregunta);
app.use('/partida', partida);
app.use('/perfil', perfil);

app.use('/api/pregunta', preguntaApi);
app.use('/api/ranking', rankingApi);
app.use('/api/partida', partidaApi);
app.use('/api/perfil', perfilApi);





app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/main',
                                      failureRedirect: '/login' }));


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//User
//app.all('*', function (req, res, next) {
//    if (req.session.passport.user) {
//        res.locals.username = usuario.displayName;
//        res.locals.username = usuario.photos[0].value;
//        app.locals.username = usuario.displayName;
//        app.locals.username = usuario.photos[0].value;
//    };
//    next();
//});

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
