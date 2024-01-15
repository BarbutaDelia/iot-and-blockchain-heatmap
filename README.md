# IoT and Blockchain Heatmap

## Description

**This project is a solution designed to foster environmental responsibility** by creating a public, real-time heatmap of pollution levels. It leverages the Ethereum blockchain to record water pollution data at key points, particularly where companies dispose of waste. The use of blockchain technology ensures the immutability and transparency of the data. Users can view a heatmap of the pollution levels and access various statistics derived from this data.

## Installation

### Prerequisites

- **Node.js**: Required for running the application.
- **Ethereum Node or Infura Project**: For connecting to the Ethereum network.
- **Package Manager**: npm or yarn for managing dependencies.
- **MetaMask Wallet**: For Ethereum transactions and interactions.

### Setup

1. **Clone the repository:**
git clone <repository-url>
2. **Navigate to the project directory:**
cd iot-and-blockchain-heatmap
3. **Install the dependencies:**

### Running the Application

To start the application, run:
node app.js
or
nodemon app.js

## Technologies and Libraries

- **Ethereum Blockchain**: For storing pollution data.
- **Web3.js**: Ethereum JavaScript API for interacting with the Ethereum blockchain.
- **Express.js**: Web application framework for Node.js.
- **EJS**: Templating engine to generate HTML markup with plain JavaScript.
- **Bootstrap**: For styling and responsive design.
- **OpenLayers (ol)**: An open-source JavaScript library for displaying map data.

## Configuration

- **Infura Project**: Set up an Infura project and include your project ID in the application configuration.
- **Account Address and Private Key**: Add an `accountAddress` and `privateKey` for transactions on the Ethereum network.
- **Ensure Correct Configuration**: Make sure the Ethereum node or Infura project is correctly configured in the application.


## Usage

Once the application is running:

- Visit the web application via the browser to view the heatmap.
- Interact with the map to view pollution data at different locations.
- Access the "Statistics" section from the sidebar to view aggregated pollution data and trends.
- **MetaMask Wallet**: Ensure your MetaMask wallet is connected for full interaction with the application.

