// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Pollution {

    struct PollutionData {
        uint timestamp;
        uint pollutionLevel;
    }

    struct Sensor {
        string companyName;
        int latitude;
        int longitude;
        PollutionData[] pollutionData;
    }

    Sensor[] public sensors;

    event PollutionDataAdded(uint sensorIndex, uint pollutionLevel, uint timestamp);

    function addSensor(string memory companyName, int latitude, int longitude) public {
        Sensor storage sensor = sensors.push();
        sensor.companyName = companyName;
        sensor.latitude = latitude;
        sensor.longitude = longitude;
    }

    function addMultipleSensors(string[] memory companyNames, int[] memory latitudes, int[] memory longitudes) public {
        require(companyNames.length == latitudes.length && latitudes.length == longitudes.length, "Arrays must be of equal length");

        for (uint i = 0; i < companyNames.length; i++) {
            Sensor storage newSensor = sensors.push();
            newSensor.companyName = companyNames[i];
            newSensor.latitude = latitudes[i];
            newSensor.longitude = longitudes[i];
        }
    }

    function getSensor(uint sensorIndex) 
    public 
    view
    returns (Sensor memory)  {
        require(sensorIndex < sensors.length, "Invalid sensor index");
        return sensors[sensorIndex];
    }

    function getSensors() 
    public 
    view
    returns (Sensor[] memory)  {
        return sensors;
    }


    function addPollutionData(uint sensorIndex, uint pollutionLevel) public {
        require(sensorIndex < sensors.length, "Invalid sensor index");
        PollutionData memory newPollutionData = PollutionData(block.timestamp, pollutionLevel);
        sensors[sensorIndex].pollutionData.push(newPollutionData);

        emit PollutionDataAdded(sensorIndex, pollutionLevel, block.timestamp);
    }


    // Adds a new poluttion data entry for a sensor, with a probability
    function updatePollutionData(uint sensorIndex, uint8 probabilityPercentage, uint8 percentageChange) public {
        require(sensorIndex < sensors.length, "Invalid sensor index");
        require(probabilityPercentage <= 100, "Invalid probability percentage");

        // Check probability
        if (random() < probabilityPercentage) {
            uint lastIndex = sensors[sensorIndex].pollutionData.length - 1;
            uint newPollutionLevel = sensors[sensorIndex].pollutionData[lastIndex].pollutionLevel
             + (sensors[sensorIndex].pollutionData[lastIndex].pollutionLevel * percentageChange / 100);
            addPollutionData(sensorIndex, newPollutionLevel);
        }
    }

    // Random number
    function random() 
    private 
    view 
    returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%100);
    }
}
