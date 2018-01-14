const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/search', (req, res) => {
		res.send("Searching for: " + req.query.term);
	});

app.listen(3000, () => console.log('Example app listening on port 3000!'))