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
const { contractAbi, contractAddress, precision } = require('./public/js/config');

app.get('/pollution', async (req, res) => {
    const web3 = new Web3('https://sepolia.infura.io/v3/39f30b6a2b9f47bb9e8cf329374cbbb8');
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    try {
        let sensorsData = await contract.methods.getSensors().call();
		let processedData = sensorsData.map(sensor => {
            // lat and lng are stored as integers on the blockchain and need to be converted
            let latitude = parseInt(sensor.latitude) / precision;
            let longitude = parseInt(sensor.longitude) / precision;
            
            // Get the latest pollution data
            let latestPollutionData = sensor.pollutionData.length > 0 ? Number(sensor.pollutionData[sensor.pollutionData.length - 1].pollutionLevel) : null;
            
            // Get the timestamp of the last sensor read
            let dataCollectionTimestamp = sensor.pollutionData[sensor.pollutionData.length - 1].timestamp.toString();

            return {
                companyName: sensor.companyName,
                lat: latitude,
                lng: longitude,
                pollution: latestPollutionData,
                timestamp: dataCollectionTimestamp
            };
        }).filter(sensor => sensor.pollution !== null);
        console.log(processedData);
        res.json(processedData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from the blockchain');
    }
});

app.get('/', async (req, res) => {
    res.render('index');
});


app.post('/', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

app.listen(port, () => console.log(`Serverul ruleaza la adresa http://localhost:` + port));