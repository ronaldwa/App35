var user   = require('../../app/models/user.js');
var configDB = require('../../config/database.js');
var mongoose = require('mongoose');
var whisky   = require('../../app/models/whisky.js');

var conn = mongoose.createConnection(configDB.url);
var User = conn.model('User');
var Whisky = conn.model('Whisky');

exports.get = function(req, res){
        id = req.params.id;
        alreadyVoted = false;
        counter = 0;
        sum = 0;
        description = [];
        Whisky.find({_id: id}).lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else
        {
            var grading;
            for(var key in result[0].ratings){
                userID = Object.keys(result[0].ratings[key])[0];
                if(Object.keys(result[0].ratings[key])[0] == req.user._id){
                    grading = result[0].ratings[key][req.user._id].rating;
                    alreadyVoted = true;
                }
                counter++;
                sum = sum + result[0].ratings[key][userID].rating;
                description.push(result[0].ratings[key][userID].description);
            }
            mean = sum / counter;
            reviewCheck = false;
            if(result[0].ratings.length === 0){
                mean = "No ratings yet!";
                reviewCheck = true;
            }
            global.info = result;
            console.log(global.info);
            res.render('pages/whisky.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyInfo: global.info,
                alreadyVoted: alreadyVoted,
                grading: grading,
                mean: mean,
                description: description,
                userid: req.user._id,
                reviewCheck: reviewCheck
            });
        }
    });
};