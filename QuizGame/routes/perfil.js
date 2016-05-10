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


router.get('/:perfilId/', function (req, res) {
    
    var perfilId = req.params.perfilId;    
    console.log('perfilId:', perfilId);
    
    var perfilVm = {
        perfil: {
            nombre: '',
            apellido: '',
            nick: '',
            imagenUrl:''
        }
    };

    //partidaRepository.obtener(partidaId, function (item) {
    //    rankingVm.partida = item;

    //    if (rankingVm.partida.jugadores!= undefined && rankingVm.partida.jugadores.length) { 
    //        rankingVm.tieneJugadores = true;
    //    }
        
        res.render('perfil', perfilVm   );
    //});
    
    
    
});






module.exports = router;