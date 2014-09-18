var express = require('express');
var app = express();

// Other includes.  Needed for later.
var http = require('http');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.set('port', 9000);
app.use(express.static(__dirname + '/public'));  //serve up static content (e.g. assets)
app.set('views', __dirname + '/views');  //this is where your views/markup goes
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser());

mongoose.connect('mongodb://localhost/osmmvcE2');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("database connection open");
});

var mvc = require('osmmvc');

mvc.routing(app, function(app) {
	app.get('/a/custom/route', function(req, res) {
		// I want this path to bypass the OSMMVC controller
		res.render('bypass.ejs', { title : "/a/custom/route"});
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});