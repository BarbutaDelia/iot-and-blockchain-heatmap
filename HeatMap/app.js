const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const lodash = require('lodash');
const app = express();


const port = 6789;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ol', express.static('node_modules/ol'));

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

app.listen(port, () => console.log(`Serverul ruleaza la adresa http://localhost:` + port));