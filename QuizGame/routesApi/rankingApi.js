var express = require('express');
var router = express.Router();

var config = require('../config');
var DocumentDBClient = require('documentdb').DocumentClient;
var RepositorioBase = require('../datos/repositoryBase.js');
var PartidaRepository = require('../datos/partidaRepository.js');


var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var repositoryBase = new RepositorioBase(docDbClient, config.databaseId, config.collectionId);
var partidaRepository = new PartidaRepository(repositoryBase);
repositoryBase.init();




router.get('/:partidaId', function (req, res) {

    var partidaId = req.params.partidaId;
    console.log('partidaId:', partidaId);

    var rankingVm = {
        partida: null,
        tieneJugadores: false
    };

    partidaRepository.obtener(partidaId, function (item) {
        rankingVm.partida = item;

        if (rankingVm.partida.jugadores != undefined && rankingVm.partida.jugadores.length) {
            rankingVm.tieneJugadores = true;
        }

        var ranking = {
            partida: partidaId,
            jugadores: rankingVm.partida.jugadores,
            puntos: rankingVm.puntos,
        }


        res.json('partidaRanking', ranking);
    });



});





module.exports = router;