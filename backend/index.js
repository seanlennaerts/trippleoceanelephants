const express = require('express');
const app = express();
const request = require('request-promise-native');
const cheerio = require('cheerio');
const api_key = 'SEM32B5F3A087E321FDC0B0AC6BF5FF5E383';
const api_secret = 'Zjg4Zjg4MzQxOWIzNTE0ODJiMDM1OTFlOThhY2M3YTA';
const sem3 = require('semantics3-node')(api_key,api_secret);


app.get('/', (req, res) => res.send('Hello World!'));
app.get('/search', (req, res) => {

	var result = semanticsCall(req.query.term, res);
 });
 // scanning barcode
app.get('/barcode', (req, res) => {
  request( {uri:"https://api.upcitemdb.com/prod/trial/lookup?upc="+req.query.id})
  .then( (body) => {
 	 // parse body
 	 var parsed = JSON.parse(body);
 	 var title = parsed.items[0].title;
	 var response = semanticsCall(title, res);
 	 res.json(response);
  });
 });

function semanticsCall(productName, functionResponse){
	productName = "eco " + productName;
	var api_key = 'SEM32B5F3A087E321FDC0B0AC6BF5FF5E383';
  var api_secret = 'Zjg4Zjg4MzQxOWIzNTE0ODJiMDM1OTFlOThhY2M3YTA';
  var sem3 = require('semantics3-node')(api_key,api_secret);
  var condensedResults = [];

  // Build the request
  sem3.products.products_field( "search", productName);

  // Run the request
  sem3.products.get_products(
 	 function(err, products) {
 		 if (err) {
 			 console.log("Couldn't execute request: get " + productName);
 			 return;
 		 }

 		 // Build JSON array result
 		 var results = JSON.parse(products).results;
 		 for (var i = 0; i < results.length; i++) {
 			 var siteDetails = results[i].sitedetails;
 			 for (var j = 0; j < siteDetails.length; j++) {
 				 var url = siteDetails[j].url;

 				 // Build JSON object if product supported in Amazon or Walmart
 				 if (url.includes("www.amazon.com") || url.includes("www.walmart.com")) {
 					 var condensedResult = new Object();
 					 condensedResult.name = results[i].name;
 					 condensedResult.price = results[i].price;
 					 condensedResult.brand = results[i].brand;
 					 condensedResult.url = url;
 					 condensedResult.image = results[i].images[0];

 					 if (url.includes("www.amazon.com")){
 						 condensedResult.vendor = "Amazon";
 					 } else {
 						 condensedResult.vendor = "Walmart";
 					 }
 					 condensedResults.push(condensedResult);
 				 }
 			 }
 		 }

 		 // Go to the next page
 		 sem3.products.iterate_products(
 				function(err, products) {
 					 if (err) {
 							console.log("Couldn't execute request: iterate_products");
 							return;
 					 }
 					 // Build JSON array result
 					 var results = JSON.parse(products).results;
 					 for (var i = 0; i < results.length; i++) {
 						 var siteDetails = results[i].sitedetails;
 						 for (var j = 0; j < siteDetails.length; j++) {
 							 var url = siteDetails[j].url;

 							 // Build JSON object if product supported in Amazon or Walmart
 							 if (url.includes("www.amazon.com") || url.includes("www.walmart.com")) {
 								 var condensedResult = new Object();
 								 condensedResult.name = results[i].name;
 								 condensedResult.price = results[i].price;
 								 condensedResult.brand = results[i].brand;
 								 condensedResult.url = url;
 								 condensedResult.image = results[i].images[0];

 								 if (url.includes("www.amazon.com")){
 									 condensedResult.vendor = "Amazon";
 								 } else {
 									 condensedResult.vendor = "Walmart";
 								 }
 								 condensedResults.push(condensedResult);
 							 }
 						 }
 					 }
 					 //console.log("Condensed Results" + JSON.stringify(condensedResults));
 					 //res.json(condensedResults);
 				}
 		 );
 		 //console.log("Condensed Results" + JSON.stringify(condensedResults));
		 debugger;
		 functionResponse.json(condensedResults);

 	 }
  );

 // 	debugger;
 // 	request({
 // 		uri: "https://www.amazon.com/s/field-keywords="+productName,
 // 		transform: function (body) {
 // 	   			return cheerio.load(body);
 // 	   		}
 // 		})
 // 		.then(function($) {
 // 			var o = [];
 // 			debugger;
 // 			$(".s-item-container").each((index, element) => {
 // 				debugger;
 // 				o.push({title: $(this).find('.s-access-title')[0]['data-attribute'] });
 // 			});
 // 			debugger;
 // 		res.json(o);
 // 	});

}

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