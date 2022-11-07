// Requiring in-built https for creating
// https server
const https = require("https");
  
// Express for handling GET and POST request
const express = require("express");
const app = express();
  
// Requiring file system to use local files
const fs = require("fs");
  
// Parsing the form of body to take
// input from forms
const bodyParser = require("body-parser");
  
// Configuring express to use body-parser
// as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  
app.get("/baseline/index.html", function (req, res) {
   res.sendFile(__dirname + "/baseline/index.html");
});

app.get("/baseline/service_worker.js", function (req, res) {
   res.sendFile(__dirname + "/baseline/service_worker.js");
});

app.get("/sxg/certificate.cbor", function (req, res) {
  res.setHeader('Content-Type', 'application/cert-chain+cbor');
  res.sendFile(__dirname + "/sxg/certificate.cbor");
});

app.get("/sxg/index.sxg", function (req, res) {
  res.setHeader('Content-Type', 'application/signed-exchange;v=b3');
  res.set('X-Content-Type-Options', 'nosniff');
  res.sendFile(__dirname + "/sxg/index.sxg");
});

app.get("/sxg/service_worker.sxg", function (req, res) {
  res.setHeader('Content-Type', 'application/signed-exchange;v=b3');
  res.set('X-Content-Type-Options', 'nosniff');
  res.sendFile(__dirname + "/sxg/service_worker.sxg");
});

// Creating object of key and certificate
// for SSL
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};
  
// Creating https server by passing
// options and app object
https.createServer(options, app)
.listen(3000, function (req, res) {
  console.log("Server started at port 3000");
});
