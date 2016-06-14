var config = require('../config');

function AdminNegocio() {
}

module.exports = AdminNegocio;

AdminNegocio.prototype = {
    
    esAdmin: function (u) {
        var esAdmin = false;
        
        if (u === undefined || u == null) return esAdmin;
        
        for (var i = 0; i < config.administradores.length ; i++) {
            var adminItem = config.administradores[i];
            if (u.id == adminItem.id && u.provider === adminItem.provider) {
                esAdmin = true;
                break;
            }
        };

        return esAdmin
    },
    
};