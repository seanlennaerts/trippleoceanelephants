const express = require('express');
const app = express();
const request = require('request-promise');
const cheerio = require('cheerio');


app.get('/', (req, res) => res.send('Hello World!'));
app.get('/search', (req, res) => {
		debugger;
	 	request({ 
	 		uri: "https://www.amazon.com/s/field-keywords=organic+"+req.query.term,
	 		transform: function (body) {
       			return cheerio.load(body);
       		}
    	})
    	.then(function($) {
    		var o = [];
    		$(".s-access-title").each((i,e) => { o.push({ "title": e['attribs']['data-attribute'] }); });
    		debugger;

			res.json(o);
		});
	});

app.listen(3000, () => console.log('Example app listening on port 3000!'))