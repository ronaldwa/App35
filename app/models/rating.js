// /config/rating.js
var User   = require('../models/user');
var configDB = require('../../config/database.js');
var mongoose = require('mongoose');
var whisky;

var conn = mongoose.createConnection(configDB.url);
var User = conn.model('User');

module.exports = {

	check: function(whisky, req, res){
     var query = {};
     query[whisky] = {$ne: []};
        //query.ratings.$elemMatch[whisky] = {$gt: 0};

        User.find({$and: [{_id:req.user._id}, {ratings: {$elemMatch: query}}]})
        .exec(function(err, result){
        	if(err){
        		console.log(err);
        	}
        	else if(!result.length){
        		User.findByIdAndUpdate(
        			req.user._id,
        			{$addToSet: {"ratings": {2 : {rating: 7, description: "Very nice whisky!"}}}},
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
                message = "Hello!";
                var rating = result[0].ratings;

                for (var i = rating.length - 1; i >= 0; i--) {
                    
                    for(var key in rating[i]){
                        console.log(rating[i][key]["rating"]);
                    }

                };
                
                console.log("You already voted for this whisky");
                res.redirect('/rated');
                console.log(result);
                console.log(message);
            }
        });
}
}