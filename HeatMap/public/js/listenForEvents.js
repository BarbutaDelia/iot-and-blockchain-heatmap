import { contractAbi, contractAddress } from './configES6.js';
import { initializeHeatMap, updateStatistics, handleSideBarCollapse } from './heatmap.js';

function updateMap() {
    fetch("/pollution")
        .then((response) => response.json())
        .then((pollutionData) => {
            const newMap = initializeHeatMap(pollutionData.processedData);
            updateStatistics(pollutionData.averagePollutionByCompany);
            handleSideBarCollapse();
        })
        .catch((error) => console.error("Error updating map data:", error));
}

// Check if Web3 is injected
if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    // Subscribe to the PollutionDataAdded event
    contract.events.PollutionDataAdded()
    .on('data', (event) => {
        console.log('Pollution data added:', event);
        updateMap();
    })
    contract.events.PollutionDataAdded()
    .on('error', error => {
        console.error(error);
    });
} else {
    console.log('Please install MetaMask!');
}

