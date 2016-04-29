var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');
var repositoryBase = require('./repositoryBase');


function PartidaRepository(repositoryBase) {
    this.repositoryBase = repositoryBase;
}

module.exports = PartidaRepository;

PartidaRepository.prototype = {

    listado: function (req, res) {
        var self = this;
        
        var querySpec = {
            query: 'SELECT * FROM root r',
            parameters: []
        };
        
        self.repositoryBase.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }
            
            var partidaVm = {
                partidas: items
            };
            
    
            res.render('partidaListado', partidaVm);
        });
    },
    
    guardar: function (item) {
        var self = this;

        self.repositoryBase.addItem(item, function (err) {
            if (err) {
                throw (err);
            }
        });
    }
};