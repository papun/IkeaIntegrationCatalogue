var express = require('express');
var session = require('express-session');
var createError = require('http-errors');
var app = express();
app.use(session({ secret: 'keyboard cat',name: "IkeaCatalogue",resave: true,
saveUninitialized: true, cookie: { maxAge: 600000 }}))
app.use(express.static('public'))
var path = require('path');
var Request = require("request");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Set the default templating engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", function (req, res) {
	res.render("index");
});

app.get('/about', function (req, res) {
	res.render('about', { title: 'title' });
});

app.get('/services', function (req, res) {
	res.render('contact', { title: 'title' });
});

app.get('/searchresults', function (req, res) {
	var ssn;
	ssn = req.session;
	var id = ssn.intnum;
	console.log("Intnum from getfunction :"+id);
	if (id != undefined) {
		doCall(id, function(response){
			res.render('results', { data: response });
		})
	} else {
		res.redirect('/');
	}
	
});

app.post('/searchresults', function (req, res) {
	var id = req.body.intnum;
	var ssn;
	ssn = req.session;
	ssn.intnum = id;
	console.log("Intnum from postfunction :"+id);
	doCall(id, function(response){
		res.render('results', { data: response });
	})
});

function doCall(id, callback) {
    console.log("Intnum from docall :"+id);
	var url = "https://samples.openweathermap.org/data/2.5/weather?id="+ id +"&appid=b6907d289e10d714a6e88b30761fae22";
	console.log("Url is " +url)
	Request.get(url, (error, response, body) => {
		if (error) {
			return console.dir(error);
		}
        return callback(JSON.parse(body));
    });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	
	next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.path = req.path;
	// render the error page
	res.status(err.status || 500);
	res.render('error');
  });

app.listen(3000, function () {
	console.log("server is listening!!!");
});
