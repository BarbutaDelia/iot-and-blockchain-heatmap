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

const { Web3 } = require('web3');
const { contractAbi, contractAddress } = require('./public/js/config');

app.get('/', async (req, res) => {
    const web3 = new Web3('https://sepolia.infura.io/v3/39f30b6a2b9f47bb9e8cf329374cbbb8');
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    try {
        const sensorsData = await contract.methods.getSensors().call();
		console.log(sensorsData);
        res.render('index', { pollutionData: sensorsData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from the blockchain');
    }
});


app.post('/', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

app.listen(port, () => console.log(`Serverul ruleaza la adresa http://localhost:` + port));