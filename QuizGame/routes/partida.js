var express = require('express');
var router = express.Router();


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



router.get('/listado', function (req, res) {
    
    var partidaVm = { };

    partidaVm.partidas = [
        { descripcion: 'Partida 1' },
        { descripcion: 'Partida 2' }
    ];    

    res.render('partidaListado', partidaVm);
});

router.get('/crear', function (req, res) {
    
    var partidaVm = {};
    
    
    res.render('partidaCrear', partidaVm);
});

router.get('/crear', function (req, res) {
    
    var partidaVm = {};
    
    
    res.render('partidaCrear', partidaVm);
});


module.exports = router;