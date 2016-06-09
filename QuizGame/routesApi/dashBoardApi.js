var express = require('express');
var router = express.Router();

var config = require('../config');
var DocumentDBClient = require('documentdb').DocumentClient;
var RepositorioBase = require('../datos/repositoryBase.js');
var JugadaRepository = require('../datos/jugadaRepository.js');
var PartidaRepository = require('../datos/partidaRepository.js');
var PreguntaRepository = require('../datos/preguntaRepository.js');
var JugadorRepository = require('../datos/jugadorRepository.js');



var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});


var repositoryBaseParaJugada = new RepositorioBase(docDbClient, config.databaseId, config.collectionJugadas);
var jugadaRepository = new JugadaRepository(repositoryBaseParaJugada);
repositoryBaseParaJugada.init();

var repositoryBaseParaPartida = new RepositorioBase(docDbClient, config.databaseId, config.collectionId);
var partidaRepository = new PartidaRepository(repositoryBaseParaPartida);
repositoryBaseParaPartida.init();

var repositoryBaseParaPregunta = new RepositorioBase(docDbClient, config.databaseId, config.collectionPreguntas);
var preguntaRepository = new PreguntaRepository(repositoryBaseParaPregunta);
repositoryBaseParaPregunta.init();

var repositoryBaseParaJugador = new RepositorioBase(docDbClient, config.databaseId, config.collectionJugadores);
var jugadorRepository = new JugadorRepository(repositoryBaseParaJugador);
repositoryBaseParaJugador.init();



router.get('/totales', function (req, res) {

    //Creando viewModel para partidas
    var totalesVm = {
        mensaje: '',
        jugada: null,
        partidas: null,
        preguntas: null,
        jugador: null,
     
    };

    //Consultando al repository

        jugadaRepository.listado(function (jugada) {
            if (jugada != null) {
                totalesVm.jugada = jugada.length;
            } else { totalesVm.mensaje = 'Sin jugadas generadas'; }
        }),

        partidaRepository.listado(function (partidas) {
            if (partidas != null) {
                totalesVm.partidas = partidas.length;
            } else { totalesVm.mensaje = 'Sin partidas generadas'; }
        }),



        preguntaRepository.listado(function (preguntas) {
            if (preguntas != null) {
                totalesVm.preguntas = preguntas.length;
            } else { totalesVm.mensaje = 'Sin preguntas generadas'; }
        }),



       jugadorRepository.listado(function (jugador) {
            if (jugador != null) {
               totalesVm.jugador = jugador.length;
           } else { totalesVm.mensaje = 'Sin jugadores generadas'; }
       }),


         



            res.render('dashboardAdmin', totalesVm);
    });

module.exports = router;