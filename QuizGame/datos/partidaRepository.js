var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
var repositoryBase = require('./repositoryBase');


function PartidaRepository(repositoryBase) {
    this.repositoryBase = repositoryBase;

}

module.exports = PartidaRepository;

PartidaRepository.prototype = {

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

    eliminar: function (id, callback) {
        var self = this;
        
        self.repositoryBase.deleteItem(id, function (err, itemEliminado, seElimino) {
            if (err) {
                throw (err);
            }
            callback(itemEliminado, seElimino);
        });
    }
        //self.repositoryBase.deleteItem(id, function (err) {
        //    if (err) {
        //        throw (err);
        //    }
            
        //    callback(true);
        //});

};