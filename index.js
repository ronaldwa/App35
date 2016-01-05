var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');
var urldb = 'postgres://fmnphruqkxxdev:54CeYQTVb_C2JGzeARymlGM_Ty@ec2-54-204-39-67.compute-1.amazonaws.com:5432/dd5farsl3q18a0?ssl=true';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  pg.connect(urldb, function(err, client, done) {
    client.query('SELECT * FROM song_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/index', {results: result.rows} ); }
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
