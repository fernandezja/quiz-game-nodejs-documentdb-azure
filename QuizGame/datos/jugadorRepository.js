var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
var repositoryBase = require('./repositoryBase');


function JugadorRepository(repositoryBase) {
    this.repositoryBase = repositoryBase;

}

module.exports = JugadorRepository;

JugadorRepository.prototype = {

    listado: function (callback) {
        var self = this;
        
        var querySpec = {
            query: 'SELECT * FROM root r',
            parameters: []
        };
        
        self.repositoryBase.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            
            callback(items);
            
        });
    },
    
    guardar: function (item, callback) {
        var self = this;
        
        var provider = item.provider || '';
        var id = item.id || '';
        
        var jugadorParaGuardar = {
            identificador: provider+'-'+id,
            displayName: item.displayName,
            imagenUrl: null
        }

        if (item.photos) {
            jugadorParaGuardar.imagenUrl = item.photos[0].value;
        } else {
            jugadorParaGuardar.imagenUrl = '/imagenes/usuario-anonimo.png';
        }


        self.repositoryBase.addItem(jugadorParaGuardar, function (err) {
            if (err) {
                throw (err);
            }
            callback(null, jugadorParaGuardar);
        });
    },

    obtener: function (id, callback) {
        var self = this;
        self.repositoryBase.getItem(id, function (err, item) {
            if (err) {
                throw (err);
            }
            callback(item);
        });
    },
    
    obtenerPorIdentificacion: function (identificador, callback) {
        var self = this;
        
        
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.identificador = @identificador',
            parameters: [{
                    name: '@identificador',
                    value: identificador
                }]
        };
        self.repositoryBase.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            callback(items);
        });
    },
    
    
    obtenerPorUsuario: function (usuario, callback) {
        var self = this;
        
        var proveedor = usuario.proveedor || '';
        var id = usuario.id || '';
        
        var identificador = proveedor + '-' + id;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.identificador = @identificador',
            parameters: [{
                    name: '@identificador',
                    value: identificador
                }]
        };
        self.repositoryBase.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            callback(items);
        });
    },
    
    obtenerPorUsuarioOCrear: function (usuario, callback) {
        var self = this;
        
        if (usuario.provider === undefined) {
            callback(null);
            return;
        }

        var provider = usuario.provider || '';
        var id = usuario.id || '';
        
        var identificador = provider + '-' + id;
        
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.identificador = @identificador',
            parameters: [{
                    name: '@identificador',
                    value: identificador
                }]
        };

        self.repositoryBase.find(querySpec, function (err, item) {
            if (err) {
                throw (err);
            }
            
            if (item == null || item.length === 0) {
                usuario.identificador = identificador;
                self.guardar(usuario, function (err, itemGuardado) {
                    if (err) {
                        throw (err);
                    }
                    callback(itemGuardado);
                })
            } else { 
                callback(item[0]);
            }

           
        });
    },

    eliminar: function (id, callback) {
        var self = this;
        
        self.repositoryBase.deleteItem(id, function (err, itemEliminado, seElimino) {
            if (err) {
                throw (err);
            }
            callback(itemEliminado, seElimino);
        });
    }
};