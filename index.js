var express = require('express');
var app = express();
var urldb = 'postgres://fmnphruqkxxdev:54CeYQTVb_C2JGzeARymlGM_Ty@ec2-54-204-39-67.compute-1.amazonaws.com:5432/dd5farsl3q18a0?ssl=true';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
