const express = require('express');
const app = express();
const request = require('request-promise');
const cheerio = require('cheerio');


app.get('/', (req, res) => res.send('Hello World!'));
app.get('/search', (req, res) => {
	var api_key = 'SEM32B5F3A087E321FDC0B0AC6BF5FF5E383';
	var api_secret = 'Zjg4Zjg4MzQxOWIzNTE0ODJiMDM1OTFlOThhY2M3YTA';
	var sem3 = require('semantics3-node')(api_key,api_secret);

	// Build the request
	sem3.products.products_field( "search", req.query.term);


	// Run the request
	sem3.products.get_products(
		function(err, products) {
			if (err) {
				console.log("Couldn't execute request: get " + req.query.term);
				return;
			}
			res.json(JSON.parse(products));
			// View results of the request
			//console.log( "Results of request:\n" + JSON.stringify( products ) );
		}
	);
	// debugger;
	// request({
	// 	uri: "https://www.amazon.com/s/field-keywords=organic+"+req.query.term,
	// 	transform: function (body) {
	//    			return cheerio.load(body);
	//    		}
	// 	})
	// 	.then(function($) {
	// 		var o = [];
	// 		$(".s-access-title").each((i,e) => { o.push({ "title": e['attribs']['data-attribute'] }); });
	// 		debugger;
	// 	res.json(o);
	// });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
