const api_key = 'SEM32B5F3A087E321FDC0B0AC6BF5FF5E383';
const api_secret = 'Zjg4Zjg4MzQxOWIzNTE0ODJiMDM1OTFlOThhY2M3YTA';
const sem3 = require('semantics3-node')(api_key,api_secret);

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

module.exports = { semanticsCall }