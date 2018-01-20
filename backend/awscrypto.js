const crypto = require('crypto');
const encodeurl = require('encodeurl');
const aws_prepend = "GET\nwebservices.amazon.com\n/onca/xml";
const aws_creds = JSON.parse("./aws_creds");

function generate_hash(request_string) { 
	var hash = crypto.createHmac('sha256', aws_creds.secret)
               .update(encodeUrl(request_string))
               .digest('hex');
  return encodeUrl(hash);
}

module.exports = { generate_hash }