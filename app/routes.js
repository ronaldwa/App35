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
        res.render('pages/profile.ejs', {
            user : req.user // get the user out of session and pass to template
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
        Whisky.find({_id: id}).exec(function(err, result){
          if(err){
            console.log(err);
        }
        else
        {
          global.info = result;
            res.render('pages/whisky.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyInfo: global.info,
                //grading: number
            });
        }
    });
      //  console.log(id);
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

    app.get('/00001', isLoggedIn, function(req, res){
        res.render('pages/drinks/00001.ejs', {
            user: req.user
        });
    });

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

    app.get('/list_blended', isLoggedIn, function(req, res){
        Whisky.find({type: 'Blended'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_blended.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/list_bourbon', isLoggedIn, function(req, res){
        Whisky.find({type: 'Bourbon'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_bourbon.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/list_corn', isLoggedIn, function(req, res){
        Whisky.find({type: 'Corn'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_corn.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/list_grain', isLoggedIn, function(req, res){
        Whisky.find({type: 'Grain'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_grain.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/list_malt', isLoggedIn, function(req, res){
        Whisky.find({type: 'Malt'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_malt.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/list_rye', isLoggedIn, function(req, res){
        Whisky.find({type: 'Rye'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_rye.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/list_singlepot', isLoggedIn, function(req, res){
        Whisky.find({type: 'Single Pot Still'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_singlepot.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/list_tennessee', isLoggedIn, function(req, res){
        Whisky.find({type: 'Tennessee'}).sort('name').lean().exec(function(err, result){
          if(err){
            console.log(err);
        }
        else{
            console.log(result);
            global.results = result;
            res.render('pages/list_tennessee.ejs', {
                user : req.user, // get the user out of session and pass to templat
                whiskyName: global.results
            });
        }
    });
    });

    app.get('/rateTwoStars', isLoggedIn, function(req, res){
    });

    app.post('/searchresult', isLoggedIn, function(req, res) {
      Whisky.find({name: {$regex :  req.body.search}}).sort('name').lean().exec(function(err, result){
        if(err){
          console.log(err);
      }
      else{
          console.log(result);
          global.results = result;
          res.render('pages/searchresult.ejs', {
              user : req.user, // get the user out of session and pass to templat
              whiskyName: global.results
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
