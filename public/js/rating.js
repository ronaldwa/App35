// /config/rating.js
var User   = require('../../app/models/user.js');
var configDB = require('../../config/database.js');
var mongoose = require('mongoose');
var whisky;

var conn = mongoose.createConnection(configDB.url);
var User = conn.model('User');

exports.check = function(whisky, description, req, res){
    console.log(whisky);
    global.rated = 7;
    var getWhiskyNumber = {
        ratings: {
            $elemMatch: {}
        }
    };
    getWhiskyNumber.ratings.$elemMatch[whisky] = {$ne: null};
    var ratingQuery = {};
    ratingQuery[whisky] = {rating: whisky, description: "Very good whisky!"};
        //query.ratings.$elemMatch[whisky] = {$gt: 0};

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
        					console.log("Succesfully updated!");
        					res.redirect('/profile');
        				};
        			});
        		console.log(result);
        		console.log(req.user._id);
        	}
        	else{
                var rating = result[0].ratings;

                for (var i = rating.length - 1; i >= 0; i--) {
                    for(var key in rating[i]){
                        global.rated = rating[i][key]["rating"];
                        global.description = rating[i][key]["description"];
                    }

                };
                console.log("You already voted for this whisky");
                res.redirect('/rated');
                console.log(result);
            }
        });
};