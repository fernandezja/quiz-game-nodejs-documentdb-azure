var express = require('express');
var router = express.Router();

router.get('/:perfil/', function (req, res) {
    
    var perfildId = req.params.perfilId;
    
    //var perfil = {
    //    id : perfildId,
    //    nombre: 'Cristian',
    //    apellido: 'Gimenez',
    //    imagenUrl: 'foto de perfil',
    //    puntaje: '2000',
    //    preguntasTotales: '100',
    //    preguntasCorrectas: '58',
    //    preguntasIncorrectas: '42'
    //}
    
    res.json(perfil);
});

router.get('/', function (req, res) {
    
    var perfiles = [];
    for (var i = 1; i < 4; i++) {
        
        var perfil = {
            id : i,
            nombre: 'Cristhian',
            apellido: 'Chocron',
            imagenUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xlp1/v/t1.0-1/p200x200/10425355_10203649454730210_3179339780669292461_n.jpg?oh=e0ec0015be663600c4c4d9685138efcc&oe=57A4436F&__gda__=1473840083_2b8c9f95098f35878f822cb3493f6c9d',
        }
        
        perfiles.push(perfil);
    };
    
    res.json(perfiles);
});

module.exports = router;