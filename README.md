# WebSocket Server with Data Fetching

This project implements a WebSocket server that fetches data from multiple endpoints at regular intervals and broadcasts the fetched data to connected WebSocket clients. 

## Features

- Connects to multiple endpoints to fetch data periodically.
- Caches and broadcasts data to connected WebSocket clients.
- Limits the number of simultaneous WebSocket connections.
- Handles connection management and error scenarios gracefully.

## Requirements

- Node.js (v14 or later recommended)
- npm (or yarn)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/ManmeetSinghJohal/websocket-server
    cd websocket-server
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

## Configuration

- The server listens on port `8000` by default, but you can set a different port by defining the `PORT` environment variable.

    ```bash
    export PORT=8080
    ```

- Adjust the `ENDPOINTS` array in the code to include the URLs from which you want to fetch data.

## Running the Server

Start the server using the following command:

```bash
npm start
```
## How It Works

- **Fetching Data:** The server periodically fetches data from the URLs specified in the `ENDPOINTS` array every 20 seconds.

- **Caching Data:** Fetched data is cached in the `cachedData` variable.

- **Broadcasting Data:** Cached data is broadcasted to all connected WebSocket clients.

- **Connection Management:** Limits the number of WebSocket connections to `30`. New connections are rejected if the limit is reached.

- **Connection Identification:** Each connection is assigned a unique UUID for tracking and management.

- **Error Handling:** Logs errors encountered during data fetching and uses the last known good data if fetching fails.

## Dependencies

- `http`: Node.js core module for creating an HTTP server.
- `ws`: WebSocket library for handling WebSocket connections.
- `uuid4`: Library for generating unique UUIDs.
- `node-fetch`: Library for making HTTP requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, please contact Manmeet Singh Johal at mjlearn13@gmail.com.


