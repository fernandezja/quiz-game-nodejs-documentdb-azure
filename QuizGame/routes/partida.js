var express = require('express');
var router = express.Router();

var config = require('../config');
var DocumentDBClient = require('documentdb').DocumentClient;
var RepositorioBase = require('../datos/repositoryBase.js');
var PartidaRepository = require('../datos/partidaRepository.js');
var PreguntaRepository = require('../datos/preguntaRepository.js');

var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

var repositoryBaseParaPartida = new RepositorioBase(docDbClient, config.databaseId, config.collectionId);
var partidaRepository = new PartidaRepository(repositoryBaseParaPartida);
repositoryBaseParaPartida.init();

var repositoryBaseParaPregunta = new RepositorioBase(docDbClient, config.databaseId, config.collectionPreguntas);
var preguntaRepository = new PreguntaRepository(repositoryBaseParaPregunta);
repositoryBaseParaPregunta.init();


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

    //Recuperar partida de body por post
    var partida = req.body;
    if (partida === undefined || partida == null) throw (null);

    //Vmara
    var partidaVm = {
        seGuardo: false,
        mensaje: '',
        partida: null
    };

    partidaRepository.guardar(partida, function (itemCreado) {
        partidaVm.partida = itemCreado;
        partidaVm.seGuardo = true;
        res.render('partidaCreada', partidaVm);
    });

   
});


router.get('/:partidaId/ranking', function (req, res) {
    
    var partidaId = req.params.partidaId;    
    console.log('partidaId:', partidaId);
    
    var rankingVm = {
        partida: null,
        tieneJugadores: false
    };

    partidaRepository.obtener(partidaId, function (item) {
        rankingVm.partida = item;

        if (rankingVm.partida.jugadores!= undefined && rankingVm.partida.jugadores.length) { 
            rankingVm.tieneJugadores = true;
        }
        
        res.render('partidaRanking', rankingVm);
    });
    
    
    
});

router.get('/:partidaId/pregunta/:preguntaId', function (req, res) {
    
    var partidaId = req.params.partidaId;
    var preguntadId = req.params.preguntaId;
    var respuestaId = req.query.respuestaId;
    console.log('partidaId:', partidaId);
    console.log('preguntadId:', preguntadId);
    console.log('respuestaId:', respuestaId);
    
    if (preguntadId==0) {
        preguntadId = null;
    }
    
    var partidaPreguntaVm = {
        partida: { id: partidaId },
        preguntaActual: null,
        preguntaSiguiente: null,
        preguntas: [],
        respuestaId: respuestaId,
        tieneRespuesta: (respuestaId != undefined),
        mensaje:''
    };

    
    //Consultando al repository
    preguntaRepository.listado(function (items) {
        
        //TODO: Ver de quitar preguntas ya respondidas por el usuario en la partida

        if (items != null) {
            shuffle(items);
            partidaPreguntaVm.preguntas = items;
        } else {
            partidaPreguntaVm.mensaje = 'Sin partidas generadas'
        }
        
        //Ver si no es la pregunta actual
        if (preguntadId) {
            partidaPreguntaVm.preguntaActual = get(partidaPreguntaVm.preguntas, preguntadId);
        } else {            
            partidaPreguntaVm.preguntaActual = partidaPreguntaVm.preguntas[0];
        }
        
        //TODO: Ver de quitar preguntas ya respondidas por el usuario en la partida
        partidaPreguntaVm.preguntaSiguiente = partidaPreguntaVm.preguntas[1];

       
        //if (respuestaId===undefined || respuestaId==null) {
        //    shuffle(partidaPreguntaVm.preguntaActual.respuestas);
        //}

        for (var i = 0; i < partidaPreguntaVm.preguntaActual.respuestas.length; i++) {
            var r = partidaPreguntaVm.preguntaActual.respuestas[i];
            
            //fix para respuestas sin id definido
            //TODO: Hashear la respuesta id con el usuario para que el id sea diferente siempre
            if (r.id===undefined) {
                r.id = i;
            }

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
        
        res.render('partidaPregunta', partidaPreguntaVm);
    });
    
    
});


router.get('/:partidaId/', function (req, res) {
    var partidaId = req.params.partidaId;
    //IR a una pregunta alteatoria
    res.redirect('/partida/'+ partidaId+'/pregunta/0');
});


//TODO: llevar a un modeulo Util o similar
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
};

//TODO: llevar a un modeulo Util o similar
function get(a, id) {
    for (var i = 0; i < a.length; i++) {
        var item = a[i];
        if (item.id=== id) {
            return item; 
        }
    };
    return null;
};





module.exports = router;