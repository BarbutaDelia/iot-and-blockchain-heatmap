# iot-and-blockchain-heatmap
Description

This project is a solution designed to foster environmental responsibility by creating a public heatmap of pollution levels. This project leverages the Ethereum blockchain for recording water pollution data at key points, particularly where companies dispose of waste. The use of blockchain technology ensures immutability and transparency of the data. Users can view a heatmap of the pollution levels and access various statistics derived from this data.

Installation

Prerequisites
Node.js
An Ethereum node or an Infura project for connecting to the Ethereum network.
A package manager like npm or yarn.

Setup

Clone the repository:
git clone <repository-url>

Navigate to the project directory:
cd iot-and-blockchain-heatmap

Install the dependencies:
npm install

Running the Application

To start the application, run:
node app.js 
or
nodemon app.js

Technologies and Libraries
Ethereum Blockchain: For storing pollution data.
Web3.js: Ethereum JavaScript API for interacting with the Ethereum blockchain.
Express.js: Web application framework for Node.js.
EJS: Templating engine to generate HTML markup with plain JavaScript.
Bootstrap: For styling and responsive design.
OpenLayers (ol): An open-source JavaScript library for displaying map data.


Configuration
You will need to set up an Infura project and include your project ID in the application configuration.
Ensure that the Ethereum node or Infura project is correctly configured in the application to interact with the blockchain.

Usage
Once the application is running:

Visit the web application via the browser to view the heatmap.
Interact with the map to view pollution data at different locations.
Access the "Statistics" section from the sidebar to view aggregated pollution data and trends.
