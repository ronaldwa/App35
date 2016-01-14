// /config/rating.js
var User   = require('../../app/models/user.js');
var Whisky = require('../../app/models/whisky.js');
var configDB = require('../../config/database.js');
var mongoose = require('mongoose');

var conn = mongoose.createConnection(configDB.url);
var Whisky = conn.model('Whisky');

exports.add = function(whiskyName, whiskyType, whiskyCountry, req, res){

    console.log(whiskyName);
    console.log(whiskyType);
    console.log(whiskyCountry);

    var whisky = new Whisky({
        name: whiskyName,
        type: whiskyType,
        country: whiskyCountry
    });

    whisky.save(function(err){
         if (err) throw err;
    });
};