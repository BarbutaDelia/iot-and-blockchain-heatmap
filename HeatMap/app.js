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
const web3 = new Web3('https://sepolia.infura.io/v3/39f30b6a2b9f47bb9e8cf329374cbbb8');
const contract = new web3.eth.Contract(contractAbi, contractAddress);

app.get('/pollution', async (req, res) => {

    try {
        let sensorsData = await contract.methods.getSensors().call();
        let companyData = {};

        // Process individual sensor data
        let processedData = sensorsData.map(sensor => {
            // lat and lng are stored as integers on the blockchain and need to be converted
            let latitude = parseInt(sensor.latitude) / precision;
            let longitude = parseInt(sensor.longitude) / precision;

            // Get the latest pollution data
            let latestPollutionData = sensor.pollutionData.length > 0 ? Number(sensor.pollutionData[sensor.pollutionData.length - 1].pollutionLevel) : null;
           
            // Get the timestamp of the last sensor read
            let dataCollectionTimestamp = sensor.pollutionData.length > 0 ? sensor.pollutionData[sensor.pollutionData.length - 1].timestamp.toString() : null;

            // Get all the history of pollution
            let pollutionHistory = [];
            for(let p of sensor.pollutionData){
                let polNumb = Number(p.pollutionLevel);
                pollutionHistory.push(polNumb);
            }

            // Accumulate data for average calculation
            if (latestPollutionData !== null) {
                if (!companyData[sensor.companyName]) {
                    companyData[sensor.companyName] = { totalPollution: 0, count: 0 };
                }
                companyData[sensor.companyName].totalPollution += latestPollutionData;
                companyData[sensor.companyName].count++;
            }
            
            return {
                companyName: sensor.companyName,
                lat: latitude,
                lng: longitude,
                pollution: latestPollutionData,
                pollutionHistory: pollutionHistory,
                timestamp: dataCollectionTimestamp
            };
        }).filter(sensor => sensor.pollution !== null);

        // Calculate average pollution for each company
        let averagePollutionByCompany = {};
        Object.keys(companyData).forEach(companyName => {
            let average = companyData[companyName].totalPollution / companyData[companyName].count;
            averagePollutionByCompany[companyName] = average;
        });

        res.json({processedData: processedData, averagePollutionByCompany: averagePollutionByCompany});
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