
function AdminNegocio() {
}

module.exports = AdminNegocio;

AdminNegocio.prototype = {
    
    esAdmin: function (usuario) {
        var esAdmin = false;
        
        if (usuario === undefined || usuario == null) return esAdmin;
        
        var administradores = [{
                user:'fernandezja',
                id: '10208402982328663'
            },
            {
                user: 'vicen.gimenez.9',
                id: '1632942720'
            },
            {
                user: 'cnchocron',
                id: '1031881238'
            },
            {
                user: 'enzo.medina.71653',
                id: '100002382406470'
            }
        ]
        
        for (var i = 0; i < administradores.length ; i++) {
            if (usuario.id == administradores[0].id) {
                esAdmin = true;
                break;
            }
        };

        return esAdmin
    },
    
};