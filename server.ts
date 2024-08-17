// // Start a WebSocket server
// import { WebSocketServer } from "ws";

// const port = 8080;
// const wss = new WebSocketServer({ port });

// // Define WebSocket server behavior

// wss.on("connection", (ws) => {
//     // Handle new client connections
//   console.log("Client connected");

//   ws.on("message", (message) => {
//     console.log(`Received: ${message}`);
//     ws.send(`You sent: ${message}`);
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// console.log(`Listening on ws://localhost:${port}`);