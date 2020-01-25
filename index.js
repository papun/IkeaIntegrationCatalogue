var express = require('express');
var app = express();
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
	res.render('index', { title: 'title' });
});

app.post('/searchresults', function (req, res) {
	var id = req.body.intnum;
	console.log(id);
	var url = "https://samples.openweathermap.org/data/2.5/weather?id="+ id +"&appid=b6907d289e10d714a6e88b30761fae22";
	console.log("Url is " +url)
	Request.get(url, (error, response, body) => {
		if (error) {
			return console.dir(error);
		}
		var obj = JSON.parse(body);
		// console.dir(JSON.stringify(obj.name).replace("",""));
		res.render('results', { data: obj });
	});
	// res.render('results', { title: id });

});


app.listen(3000, function () {
	console.log("server is listening!!!");
});
