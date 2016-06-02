var express = require('express');
var router = express.Router();


router.get('/:partidaId/', function (req, res) {
    
    var partidadId = req.params.partidaId;

    //var descripcion,
    //var latitud,
    //var longitud,

    var partida = {
        id : partidadId,
        descripcion : 'nombre partida: ' + partidadId,
        latitud: 'latitud de la partida ' + partidadId,
        longitud: 'longitud de la partida '+ partidadId, 
    }
    

    res.json(partida);
});

router.get('/', function (req, res) {
    
    var partidas = [];
    for (var i = 1; i < 100; i++) {
        
        var partida = {
            id : i,
            descripcion: 'partida ' + i,
            latitud: 'latitud' + i,
            longitud: 'longitud' + i,
        }
        
        partidas.push(partida);
    };
    
    res.json(partidas);
});

router.delete('/:partidaId', function (req, res) {
    
    var partidadId = req.params.partidaId;
    
    var respuesta = {
        mensaje: 'Se a eliminado correctamente la partida con el ID ' + partidadId,
        resultado: true
    }
    res.json(respuesta);
});

router.post('/', function (req, res) {
    
    var partida = req.body;
    if (partida === undefined || partida == null) res.json('Debe enviar una partida valida'); ;
    
    res.json(partida);
});



router.get('/:partidas/', function (req, res) {

    //ruta para api/partidas/fechaInicio/fechaTope






    res.json();
});


module.exports = router;