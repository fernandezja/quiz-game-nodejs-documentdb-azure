    var express = require('express');
var router = express.Router();


router.get('/:preguntaId/', function (req, res) {
    
    var preguntadId = req.params.preguntaId;
    
    var pregunta = {
        id : preguntadId,
        descripcion: '¿Pregunta Demo '+ preguntadId+'?',
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
    

    res.json(pregunta);
});

router.get('/', function (req, res) {
    
    var preguntas = [];
    for (var i = 1; i < 100; i++) {
    
        var pregunta = {
            id : i,
            descripcion: '¿Pregunta Demo ' + i + '?',
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

        preguntas.push(pregunta);
    };
    
    res.json(preguntas);
});

router.delete('/:preguntaId', function (req, res) {
    
    var preguntadId = req.params.preguntaId;
    
    var respuesta = {
        mensaje: 'Se a eliminado correctamente la pregunta con el ID ' + preguntadId,
        resultado: true
    }
    res.json(respuesta);
});

router.post('/', function (req, res) {
    
    var pregunta = req.body;
    if (pregunta === undefined || pregunta == null) res.json('Debe enviar una pregunta valida'); ;
    
    res.json(pregunta);
});


module.exports = router;