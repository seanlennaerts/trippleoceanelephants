const express = require('express');
const app = express();
const request = require('request-promise-native');
const cheerio = require('cheerio');
const api_key = 'SEM32B5F3A087E321FDC0B0AC6BF5FF5E383';
const api_secret = 'Zjg4Zjg4MzQxOWIzNTE0ODJiMDM1OTFlOThhY2M3YTA';
const sem3 = require('semantics3-node')(api_key,api_secret);


app.get('/', (req, res) => res.send('Hello World!'));
app.get('/search', (req, res) => {


	// Log request to console
	console.log('Received request on /search endpoint...');
	// Build the request
	sem3.products.products_field( "search", req.query.term);


	// Run the request
	sem3.products.get_products(
		function(err, products) {
			if (err) {
				console.log("Couldn't execute request: get_products");
				return;
			}
			var jsonArray = [{"name" : "abc", "url" : "https://www.amazon.com/Fusion-Queen-Stainless-Steel-Bottle/dp/B007P5SMLM/ref=sr_1_2_sspa?s=sporting-goods&ie=UTF8&qid=1515918126&sr=1-2-spons&keywords=eco+bottle&psc=1"}];
			Promise
			.all(buildPromises(jsonArray))
			.then((results) => {
				debugger;
				res.json(results);
			});

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

const wordBank = ['eco', 'sustainable', 'eco-friendly', 'sustainability', 'environment'];
const amazonSelectors = ["#feature-bullets ul li span", "#productDescription p"];
const walmartSelectors = [".product-about .about-desc"];
const targetSelectors = ["#tab-content-details div"];
function parseURL(object, selectorsObject) {
	debugger;
	return request({ 
		uri: object.url,
		transform: function(body) { 
						return cheerio.load(body);c
					}
	})
	.then(($) => {
		debugger;
		var hits = wordBank.reduce((total, element, index) => {
			debugger;
			var hitsonword = 0;
			var reg = new RegExp(element, "i");
			// Search in top feature-bullets
			selectorsObject.forEach((selector, index) => {
				try {
					hitsonword += $(selector).text().match(reg) ? 1 : 0;
				}
				catch(ex) {}
			});
			return total + hitsonword;
		}, 0);

		object.hits = hits;
		return object;

	})
	.catch((error) => { 
		console.log("Failed opening Amazon URL.");
		object.hits = -1;
		return object;
	});
}

function buildPromises(objectsArray) {
	var promises = [];

	//Pick all urls and dispatch separate promises
	objectsArray.forEach((element, index) => {
		promises.push(parseURL(element, amazonSelectors))
	});

	return promises;
}