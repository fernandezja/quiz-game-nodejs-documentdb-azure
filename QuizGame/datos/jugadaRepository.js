﻿var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
var repositoryBase = require('./repositoryBase');


function JugadaRepository(repositoryBase) {
    this.repositoryBase = repositoryBase;

}

module.exports = JugadaRepository;

JugadaRepository.prototype = {

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
    
    listadoPorPartida: function (partidaId, callback) {
        var self = this;
        
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.partidaId = @partidaId',
            parameters: [{
                    name: '@partidaId',
                    value: partidaId
                }]
        };
        
        self.repositoryBase.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }            
            callback(items);
            
        });
    },
    
    listadoPorPartidaJugador: function (partidaId, jugadorId, callback) {
        var self = this;
        
        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.partidaId = @partidaId && r.jugadorId = @jugadorId',
            parameters: [{
                    name: '@partidaId',
                    value: partidaId
                },
                {
                    name: '@jugadorId',
                    value: jugadorId
                }]
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
};