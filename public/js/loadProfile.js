var user   = require('../../app/models/user.js');
var configDB = require('../../config/database.js');
var mongoose = require('mongoose');
var whisky   = require('../../app/models/whisky.js');

var conn = mongoose.createConnection(configDB.url);
var User = conn.model('User');
var Whisky = conn.model('Whisky');

exports.load = function(user, req, res){
	User.find({_id:user._id}).exec(function(err,result){
		if(err){
			console.log(err);
		}
		else{
			lastFiveRatings = [];
			lastFiveWhiskyID = [];
			whiskyNames = [];
			var rating = result[0].ratings;
			for (var i = rating.length - 1; i >= 0; i--){
				for(var key in rating[i]){
					lastFiveRatings.push(rating[i][key]["rating"]);
					lastFiveWhiskyID.push(Object.keys((rating[i]))[0]);
				}
			}
			for(var j = 0; j <= lastFiveWhiskyID.length - 1; j++){
				Whisky.find({_id:lastFiveWhiskyID[j]}).exec(function(err,whiskyResult){
					if(err){
						console.log(err);
					}
					else{
						whiskyNames.push(whiskyResult[0].name);
						if(lastFiveWhiskyID.length === whiskyNames.length && lastFiveRatings.length === rating.length){
							res.render('pages/profile.ejs', {
                                        user : user, // get the user out of session and pass to template
                                        whiskyNames: whiskyNames,
                                        lastFiveRatings: lastFiveRatings,
                                        lastFiveWhiskyID: lastFiveWhiskyID
                                    });
						}
					}
				});
			}
		}
	});
};