// app/routes.js
var rating = require('./models/rating.js');
var User   = require('../app/models/user');
var configDB = require('../config/database.js');
var mongoose = require('mongoose');

var conn = mongoose.createConnection(configDB.url);
var User = conn.model('User');

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

    // =====================================
    // DRINKS ==============================
    //======================================
    app.get('/list', isLoggedIn, function(req, res) {
        res.render('pages/list.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/00001', isLoggedIn, function(req, res){
        res.render('pages/drinks/00001.ejs', {
            user: req.user,
            message: rating.message
        });
        whisky = 00002;
    });

    app.get('/rateOneStar', isLoggedIn, function(req, res){
        rating.check(whisky, req, res);
    });

    app.get('/rated', isLoggedIn, function(req, res){
        res.render('pages/rated.ejs', {
            user : req.user, // get the user out of session and pass to template
            message : rating.message
        });
    });

    app.get('/rateTwoStars', isLoggedIn, function(req, res){
        User.findByIdAndUpdate(
            req.user._id,
            {$addToSet: {"ratings.twoStars": 1}},
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
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));



};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
