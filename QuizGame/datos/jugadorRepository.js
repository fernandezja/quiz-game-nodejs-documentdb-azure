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
        
        var proveedor = item.proveedor || '';
        var id = item.id || '';

        item.identificador = proveedor+'-'+id;

        self.repositoryBase.addItem(item, function (err) {
            if (err) {
                throw (err);
            }

            callback(item);
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
            
            if (item == null) {
                usuario.identificador = identificador;
                self.guardar(usuario, function (err, itemGuardado) {
                    if (err) {
                        throw (err);
                    }
                    callback(itemGuardado);
                })
            }

            callback(item);
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