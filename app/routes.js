// app/routes.js
var rating = require('../public/js/rating.js');
var user   = require('../app/models/user');
var configDB = require('../config/database.js');
var mongoose = require('mongoose');
var whisky = require('../app/models/whisky.js');
var addWhisky = require('../public/js/addWhisky.js');

var conn = mongoose.createConnection(configDB.url);
var User = conn.model('User');
var Whisky = conn.model('Whisky');
var results;
global.whiskyNum = 00001;
global.varstring = "/rateOneStar";
global.whiskyID;

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
       successRedirect : '/profile', // redirect to the secure profile section
       failureRedirect : '/login', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
   }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
       successRedirect : '/profile', // redirect to the secure profile section
       failureRedirect : '/signup', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
   }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        User.find({_id:req.user._id}).exec(function(err,result){
            if(err){
                console.log(err);
            }
            else{
                lastFiveRatings = [];
                lastFiveWhiskyID = [];
                whiskyNames = [];
                console.log(result);
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
                                    console.log(whiskyNames);
                                    console.log(lastFiveRatings);
                                    res.render('pages/profile.ejs', {
                                        user : req.user, // get the user out of session and pass to template
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
        });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/whiskys/:id', isLoggedIn, function(req, res) {
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
            console.log(grading);
            global.info = result;
            console.log(global.info);
            mean = sum / counter;
            res.render('pages/whisky.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyInfo: global.info,
                alreadyVoted: alreadyVoted,
                grading: grading,
                mean: mean,
                description: description,
                userid: req.user._id,
            });
        }
    });
});

    // =====================================
    // DRINKS ==============================
    //======================================
    app.get('/add', isLoggedIn, function(req, res) {
      res.render('pages/add.ejs', {
        user: req.user
    });
  });

    app.post('/added', isLoggedIn, function(req, res) {
        addWhisky.add(req.body.name, req.body.type, req.body.country, req, res);
        res.render('pages/added.ejs', {
            user: req.user,
            whiskyName: req.body.name
        });
    });

    // app.get('/00001', isLoggedIn, function(req, res){
    //     res.render('pages/drinks/00001.ejs', {
    //         user: req.user
    //     });
    // });

app.post('/rate', isLoggedIn, function(req, res){
    whiskyRating = +req.body.whiskyRating;
    rating.add(id, req.body.description, whiskyRating, req, res);
});

app.get('/history', isLoggedIn, function(req, res) {
    res.render('pages/history.ejs', {
            user : req.user // get the user out of session and pass to template
        });
});

app.get('/rated', isLoggedIn, function(req, res){
    res.render('pages/rated.ejs', {
            user : req.user, // get the user out of session and pass to template
            rated: global.rated,
            description: global.description
        });
});

app.get('/list', isLoggedIn, function(req, res){
    Whisky.find({}).sort('name').lean().exec(function(err, result){
      if(err){
        console.log(err);
    }
    else{
        console.log(result);
        global.results = result;
        res.render('pages/list.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
    }
});
});

app.get('/list/:type', isLoggedIn, function(req, res){
    Whisky.find({type: req.params.type}).sort('name').lean().exec(function(err, result){
      if(err){
        console.log(err);
    }
    else{
        console.log(result);
        global.results = result;
        res.render('pages/shortlist.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results,
                type: req.params.type
            });
    }
});
});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
