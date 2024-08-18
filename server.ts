import http from "http";
import { WebSocket} from "ws"; 
import uuid4 from "uuid4";
import fetch from "node-fetch";

const server = http.createServer();
const wss = new WebSocket.Server({ server }); 
const port = process.env.PORT || 8000;

const ENDPOINTS = [
  "https://data--us-east.upscope.io/status?stats=1",
  "https://data--eu-west.upscope.io/status?stats=1",
  "https://data--eu-central.upscope.io/status?stats=1",
  "https://data--us-west.upscope.io/status?stats=1",
  "https://data--sa-east.upscope.io/status?stats=1",
  "https://data--ap-southeast.upscope.io/status?stats=1",
];

const connections: { [key: string]: WebSocket } = {};

async function fetchData() {
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

const broadcast = () => {
  Object.keys(connections).forEach(async (uuid) => {
    const connection = connections[uuid];
    const data = await fetchData();
    const message = JSON.stringify(data);
    connection.send(message);
  });
};

const INTERVAL = 20000; // 20 seconds

setInterval(() => {
  console.log("Fetching and broadcasting data...");
  broadcast();
}, INTERVAL);

const handleClose = (uuid: string) => {
  console.log(`${uuid} disconnected`);
  delete connections[uuid];
};

wss.on("connection", (connection, request) => {
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
