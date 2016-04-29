var express = require('express');
var router = express.Router();


router.get('/listado', function (req, res) {
    
    var partidaVm = {};
    
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

router.get('/:partidaId/ranking', function (req, res) {
    
    var partidaId = req.params.partidaId;    
    console.log('partidaId:', partidaId);
    
    var ranking = {
        partida: {
            id: 1,
            descripcion:'Partida A'
        },

        jugadores: [
            {
                id: 1,
                imagenUrl:"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/1779102_10202676177522122_79691913_n.jpg?oh=a2ea5c9594e67c7dc2df6017086e7ebc&oe=57A53E03&__gda__=1471501827_8c95c69c28c14b2ca072fdb22a322b1c",
                apellido: 'Fernandez',
                nombre: 'José',
                nickname: 'El Profe',
                puntos: 10,
                cantidadPreguntasCorrectas: 5,
                cantidadPreguntasErroneas: 5,
            },
            {
                id: 2,
                imagenUrl:"https://scontent-gru2-1.xx.fbcdn.net/hphotos-xtl1/v/t1.0-9/10425355_10203649454730210_3179339780669292461_n.jpg?oh=9a3e9d55a058d12d2b25bd50d2482abc&oe=5799909E",
                apellido: 'Chocron',
                nombre: 'Cristhian',
                nickname: 'Tiki',
                puntos: 12,
                cantidadPreguntasCorrectas: 7,
                cantidadPreguntasErroneas: 5,
            },
            {
                id: 3,
                imagenUrl:"https://scontent-gru2-1.xx.fbcdn.net/v/t1.0-9/1005540_10207158485233814_6031992102546735600_n.jpg?oh=aca12b88ea7d9bf6f4097282b230aa77&oe=57A24482",
                apellido: 'Gimenez',
                nombre: 'Cristian',
                nickname: 'El Formo',
                puntos: 15,
                cantidadPreguntasCorrectas: 10,
                cantidadPreguntasErroneas: 5,
            },
            {
                id: 4,
                imagenUrl:"https://scontent-gru2-1.xx.fbcdn.net/v/t1.0-9/11828739_889180801171325_8860912661926570810_n.jpg?oh=f0c69b54e20f9519505dc52a87c573e2&oe=57A158BE",
                apellido: 'Medina',
                nombre: 'Enzo',
                nickname: 'Enzo',
                puntos: 8,
                cantidadPreguntasCorrectas: 4,
                cantidadPreguntasErroneas: 4,
            },
        ]
    }
    
    
    
    
    res.render('partidaRanking', ranking);
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