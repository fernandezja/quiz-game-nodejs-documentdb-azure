var express = require('express');
var router = express.Router();


var config = require('../config');
var DocumentDBClient = require('documentdb').DocumentClient;
var RepositorioBase = require('../datos/repositoryBase.js');
var PreguntaRepository = require('../datos/preguntaRepository.js');


var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var repositoryBase = new RepositorioBase(docDbClient, config.databaseId, config.collectionPreguntas);
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

router.get('/listado', function (req, res) {
    
    var preguntasVm = {
        mensaje: '',
        preguntas: []
    };
    
    //Consultando al repository
    preguntaRepository.listado(function (items) {
        if (items != null) {
            preguntasVm.preguntas = items;
        } else {
            preguntasVm.mensaje = 'Sin partidas generadas'
        }
        
        res.render('preguntaListado', preguntasVm);
    });
    
    
});

router.get('/crear', function (req, res) {
    
    var preguntaVm = {};
    res.render('preguntaCrear', preguntaVm);
});


router.post('/crear', function (req, res) {
    
    var preguntaForm = req.body;
    if (preguntaForm === undefined || preguntaForm == null) throw (null);
    
    //Armando pregunta
    var pregunta = {
        descripcion: preguntaForm.descripcion,
        respuestas: []
    }
    
    if (preguntaForm.respuestaDescripcion1) {
        pregunta.respuestas.push({
            descripcion: preguntaForm.respuestaDescripcion1,
            esCorrecta: (preguntaForm.respuestaCorrecta==1)
        });
    }
    
    if (preguntaForm.respuestaDescripcion2) {
        pregunta.respuestas.push({
            descripcion: preguntaForm.respuestaDescripcion2,
            esCorrecta: (preguntaForm.respuestaCorrecta == 2)
        });
    }
    
    if (preguntaForm.respuestaDescripcion3) {
        pregunta.respuestas.push({
            descripcion: preguntaForm.respuestaDescripcion3,
            esCorrecta: (preguntaForm.respuestaCorrecta == 3)
        });
    }
    
    if (preguntaForm.respuestaDescripcion4) {
        pregunta.respuestas.push({
            descripcion: preguntaForm.respuestaDescripcion4,
            esCorrecta: (preguntaForm.respuestaCorrecta == 4)
        });
    }
    

    //Vmara
    var preguntaVm = {
        pregunta: null,
        seGuardo: false,
    };
    
    preguntaRepository.guardar(pregunta, function (itemCreado) {
        preguntaVm.pregunta = itemCreado;
        preguntaVm.seGuardo = true;
        res.render('preguntaCreada', preguntaVm);
    });

   
});



module.exports = router;