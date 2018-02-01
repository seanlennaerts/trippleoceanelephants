const express = require('express');
const fs = require("fs");
const app = express();
const request = require('request-promise-native');
const cheerio = require('cheerio');
const convert = require('xml-js')
// const awscrypto = require('./awscrypto');
// const amazon = require('amazon-product-api');
const amazon = require('./amazon-product-api/lib/index.js')
const aws_creds = JSON.parse(fs.readFileSync('./aws_creds.json', 'utf8'))	;


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

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))

var client = amazon.createClient({
  awsId: aws_creds.key,
  awsSecret: aws_creds.secret,
  awsTag: aws_creds.tag,
  locale: "ca"
});

client.itemSearch({
  // director: 'Quentin Tarantino',
  // actor: 'Samuel L. Jackson',
  // searchIndex: 'DVD',
  // audienceRating: 'R',
  keywords: 'shampoo',
  responseGroup: 'ItemAttributes'
}).then( (results) => {
	return Promise.all( results.map( (item) => {
    return client.itemLookup({
      ItemId: item.ASIN[0]
    })
  }))
  // res = convert.xml2js(results, {ignoreComment: true})
})
.then( (results) => {
  debugger;
  descs = results.filter( el => { return el[0].EditorialReviews != undefined })
  descs = descs.map( el => { return el[0].EditorialReviews[0].EditorialReview[0].Content[0] })
  if (descs.length < 1) {
    console.log("No items have editorial reviews...")
  }
  // results[1][0].EditorialReviews[0].EditorialReview[0].Content[0]
  descs = descs.map( (desc) => {
    var hits = wordBank.reduce((total, element, index) => {
      var hitsonword = 0;
      var reg = new RegExp(element, "i");
      hitsonword += desc.match(reg) ? 1 : 0;
      return total + hitsonword; 
    }, 0)
    return hits
  })

  console.log(descs.join(" | "))
})
.catch(function(err){
	// var err_obj = JSON.parse(err);
  // console.log(err_obj.Error[0].Message[0]);
  debugger;
   console.log(err);
});

// client.itemLookup({
//   ItemId: "B005GNU60U"
// }).then(function(results){
//  debugger;
//   console.log(results);
// }).catch(function(err){
//  // var err_obj = JSON.parse(err);
//   // console.log(err_obj.Error[0].Message[0]);
//   debugger;
//    console.log(err);
// });

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