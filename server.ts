import http from "http";
import { WebSocket } from "ws";
import uuid4 from "uuid4";
import fetch from "node-fetch";

import { EndpointData } from "./types/types";

const server = http.createServer();
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 8000;

// Initialize cachedData with the correct type
let cachedData: EndpointData[] = [];

const ENDPOINTS = [
  "https://data--us-east.upscope.io/status?stats=1",
  "https://data--eu-west.upscope.io/status?stats=1",
  "https://data--eu-central.upscope.io/status?stats=1",
  "https://data--us-west.upscope.io/status?stats=1",
  "https://data--sa-east.upscope.io/status?stats=1",
  "https://data--ap-southeast.upscope.io/status?stats=1",
];

const MAX_CONNECTIONS = 30; // Define the maximum number of connections allowed
const connections: { [key: string]: WebSocket } = {};

async function fetchData(): Promise<EndpointData[]> {
  try {
    const fetchPromises = ENDPOINTS.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        endpoint: url,
        data: data,
      };
    });

    const data = await Promise.all(fetchPromises);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function updateData() {
  try {
    cachedData = await fetchData();
  } catch (error) {
    console.error("Failed to fetch data, using last known good data.");
    // Optionally, notify clients of the error
  }
}

const broadcast = () => {
  const message = JSON.stringify(cachedData);
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    connection.send(message);
  });
};

const INTERVAL = 20000; // 20 seconds

setInterval(async () => {
  console.log("Fetching and broadcasting data...");
  await updateData();
  broadcast();
}, INTERVAL);

const handleClose = (uuid: string) => {
  console.log(`${uuid} disconnected`);
  delete connections[uuid];
};

wss.on("connection", (connection, request) => {
  if (Object.keys(connections).length >= MAX_CONNECTIONS) {
    console.log("Connection limit reached. Closing new connection.");
    connection.close(); // Reject the connection if limit is reached
    return;
  }

  console.log("client connected");
  const uuid = uuid4();
  console.log(`client uuid: ${uuid}`);

  connections[uuid] = connection;

  connection.on("close", () => {
    handleClose(uuid);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
