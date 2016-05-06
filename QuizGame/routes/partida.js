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

router.get('/listado', function (req, res) {
    

    //Creando viewModel para partidas
   var partidasVm = {
        mensaje: '',
        partidas: []
    };

    //Consultando al repository
    partidaRepository.listado(function (partidas) {
        if (partidas != null) {
            partidasVm.partidas = partidas;
        } else {
            partidasVm.mensaje = 'Sin partidas generadas'
        }
        
        res.render('partidaListado', partidasVm);
    });
    
    
});

router.get('/crear', function (req, res) {
    
    var partidaVm = {};
    res.render('partidaCrear', partidaVm);
});

router.post('/crear', function (req, res) {
    //recuperar partida de body por post
    var partida = req.body;
    if (partida === undefined || partida == null) throw (null);

    //creo un view model
    var vm = {
        seGuardo: false,
        mensaje: '',
        partida: null
    };

    vm.seGuardo = partidaRepository.guardar(partida);

    if (vm.seGuardo) {
        vm.partida = partida;
    } else {
        vm.mensaje = 'Tuvimos un inconveniente al guardar la partida.' 
                    + 'Intente nuevamente mas tarde';
    }
    res.render('partidaCreada', vm);
});


router.get('/:partidaId/ranking', function (req, res) {
    
    var partidaId = req.params.partidaId;    
    console.log('partidaId:', partidaId);
    
    var rankingVm = {
        partida: null
    };

    partidaRepository.obtener(partidaId, function (item) {
        rankingVm.partida = item;
    });
    
    
    res.render('partidaRanking', rankingVm);
});

router.get('/:partidaId/pregunta/:preguntaId', function (req, res) {
    
    var partidaId = req.params.partidaId;
    var preguntadId = req.params.preguntaId;
    var respuestaId = req.query.respuestaId;
    console.log('partidaId:', partidaId);
    console.log('preguntadId:', preguntadId);
    console.log('respuestaId:', respuestaId);
    
    var pregunta = {
        id : preguntadId,
        descripcion: '¿Cual es el color favorito?',
        respuestas: [
            {
                id: 1,
                descripcion: 'Rta 1',
                esCorrecta: false,
                css: 'no'
            },
            {
                id: 2,
                descripcion: 'Rta 2',
                esCorrecta: true,
                css: 'si'
            },
            {
                id: 3,
                descripcion: 'Rta 3',
                esCorrecta: false,
                css: 'no'
            }
        ]
    }
    
    for (var i = 0; i < pregunta.respuestas.length; i++) {
        var r = pregunta.respuestas[i];
        if (r.id == respuestaId) {
            if (r.esCorrecta) {
                r.css = 'btn-success';
            } else {
                r.css = 'btn-danger';
            }
            
        } else {
            r.css = '';
        }
        
    };
    
    
    var preguntaVm = {
        partida: { id: partidaId },
        pregunta: pregunta,
        respuestaId: respuestaId,
        tieneRespuesta: (respuestaId != undefined)
    };
    
    
    res.render('pregunta', preguntaVm);
});


router.get('/:partidaId/', function (req, res) {
    var partidaId = req.params.partidaId;
    //IR a una pregunta alteatoria
    res.redirect('/partida/'+ partidaId+'/pregunta/1');
});






module.exports = router;