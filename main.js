/*
* CursusDB Observer to WS Example with Express
* ******************************************************************
* Originally authored by Alex Gaetano Padula
 */
import Observer from 'cursusdb-observer-node' // Observer for Node.js required
import express from 'express' // Express
import { WebSocketServer } from 'ws'; // Ws for websocket server
import path from 'path' // for paths

const wss = new WebSocketServer({ port: 8081 }) // Create websocket server on port 8081
const app = express(); // Setup express under app constant
const port = process.env.PORT || 8080 // default to port 8080 for express

let wsConnections = [] // Current websocket connections

let ob = new Observer("yoursharedkey")

if (ob.sharedKey !== undefined) {
    ob.Start() // Start listening

    ob.events.on('event', (data) => { // On observer events relay to websocket
        wsConnections.forEach((ws) => {
            ws.send(data);
        })
    })
}

// get '/' return index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(path.resolve(), '/index.html'))
});

// On websocket server connection
wss.on('connection', function connection(ws) {

    ws.on('error', console.error);

    wsConnections = wsConnections.concat(ws)
});

wss.on('close', function close() {
    wss.clients.forEach(function each(ws) {
           ws.terminate();
    });

    wsConnections = []
});

app.listen(port) // Start listening on 8080
console.log('HTTP Server started at http://localhost:' + port)