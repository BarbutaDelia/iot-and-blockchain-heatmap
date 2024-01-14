const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const lodash = require('lodash');
const app = express();
const cron = require('node-cron');

const port = 6789;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ol', express.static('node_modules/ol'));

const { Web3 } = require('web3');
const { contractAbi, contractAddress, precision } = require('./public/js/config');
const { privateKey, accountAddress } = require('./public/js/secret-config');
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

// Cron job
// Function to trigger the smart contract method to add a new Pollution Entry
async function triggerUpdatePollutionData() {
    const sensorIndex = Math.floor(Math.random() * 18); 
    const probabilityPercentage = 99;
    const percentageChange = 10;

    // Create a transaction
    const updateData = contract.methods.updatePollutionData(sensorIndex, probabilityPercentage, percentageChange);
    const encodedABI = updateData.encodeABI();
    const estimatedGas = await updateData.estimateGas({ from: accountAddress });

    const tx = {
        from: accountAddress,
        to: contractAddress,
        gas: estimatedGas,
        data: encodedABI,
        maxPriorityFeePerGas: web3.utils.toWei('2', 'gwei'),
        maxFeePerGas: web3.utils.toWei('100', 'gwei'), 
    };
    

    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    try{
        web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', console.log)
        .on('error', console.log);
    }
    catch (error){
        console.log(error);
    }
}

// Schedule the cron job
cron.schedule('* * * * *', () => {
    console.log('Running cron job to update pollution data');
    triggerUpdatePollutionData();
});

app.listen(port, () => console.log(`Serverul ruleaza la adresa http://localhost:` + port));