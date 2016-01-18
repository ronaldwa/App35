// /config/rating.js
var user   = require('../../app/models/user.js');
var configDB = require('../../config/database.js');
var mongoose = require('mongoose');
var whisky   = require('../../app/models/whisky.js');

var conn = mongoose.createConnection(configDB.url);
var User = conn.model('User');
var Whisky = conn.model('Whisky');

exports.add = function(whiskyID, whiskyDescription, whiskyRating, req, res){
    var getWhiskyNumber = {
        ratings: {
            $elemMatch: {}
        }
    };
    getWhiskyNumber.ratings.$elemMatch[whiskyID] = {$ne: null};
    var ratingQuery = {};
    ratingQuery[whiskyID] = {rating: whiskyRating, description: whiskyDescription};

        User.find({$and: [{_id:req.user._id}, getWhiskyNumber]})
        .exec(function(err, result){
        	if(err){
        		console.log(err);
        	}
        	else if(!result.length){
        		User.findByIdAndUpdate(
        			req.user._id,
        			{$addToSet: {"ratings": ratingQuery}},
        			{safe: true, upsert: true, new : true},
        			function(err, model) {
        				if(err){
        					console.log(err);
        				}
        				else{
        				};
        			});
        	}
        	else{
                var rating = result[0].ratings;

                for (var i = rating.length - 1; i >= 0; i--) {
                    for(var key in rating[i]){
                        global.rated = rating[i][key]["rating"];
                        global.description = rating[i][key]["description"];
                    }

                };
            }
        });

var ratingQueryWhisky = {};
ratingQueryWhisky[req.user._id] = {rating: whiskyRating, description: whiskyDescription};

Whisky.find({_id: id})
.exec(function(err, result){
    if(err){
        console.log(err);
    }
    else{
        Whisky.findByIdAndUpdate(
            whiskyID,
            {$addToSet: {"ratings": ratingQueryWhisky}},
            {safe: true, upsert: true, new : true},
            function(err, model) {
                if(err){
                    console.log(err);
                }
                else{
                };
            });
    }
});

res.redirect('/whiskys/' + whiskyID);
};