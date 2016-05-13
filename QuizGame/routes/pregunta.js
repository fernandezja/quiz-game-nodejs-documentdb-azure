var express = require('express');
var router = express.Router();


var config = require('../config');
var DocumentDBClient = require('documentdb').DocumentClient;
var RepositorioBase = require('../datos/repositoryBase.js');
var PreguntaRepository = require('../datos/preguntaRepository.js');


var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var repositoryBase = new RepositorioBase(docDbClient, config.databaseId, config.collectionId);
var preguntaRepository = new PreguntaRepository(repositoryBase);
repositoryBase.init();


router.get('/partida/:partidaId/pregunta/:preguntaId', function (req, res) {
    
    var partidaId = req.params.partidaId;
    var preguntadId = req.params.preguntaId;
    console.log('partidaId:', partidaId);
    console.log('preguntadId:', preguntadId);
    

    var pregunta = {
        id : preguntadId,
        descripcion: '¿Cual es el color favorito?',
        respuestas: [
            {
                id: 1,
                descripcion: 'Rta 1',
                esCorrecta: false,
            },
            {
                id: 2,
                descripcion: 'Rta 2',
                esCorrecta: true,
            },
            {
                id: 3,
                descripcion: 'Rta 3',
                esCorrecta: false,
            }
        ]
    }
    
    
    var preguntaVm = {
        partida: { id: 8 },
        pregunta: pregunta
    };
    

    res.render('pregunta', preguntaVm);
});


router.post('/crear', function (req, res) {
    
    var pregunta = req.body;
    if (pregunta === undefined || pregunta == null) throw (null);
    
    //Vmara
    var preguntaVm = {
        pregunta: null,
        seGuardo: false,
    };
    
    preguntaRepository.guardar(pregunta, function (itemCreado) {
        preguntaVm.partida = itemCreado;
        preguntaVm.seGuardo = true;
        res.render('preguntaCreada', preguntaVm);
    });

   
});



module.exports = router;