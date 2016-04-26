var express = require('express');
var router = express.Router();


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

module.exports = router;