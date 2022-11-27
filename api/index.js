("use strict");

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
var cors = require("cors");
const https = require("https");
const fs = require("fs");
const connection = require('./database');

var port = process.env.API_PORT;
const app = express();

app.use(bodyParser.json());
// app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.route('/users')
  .get(function(req, res, next) {
    connection.query(
      "SELECT * FROM `users`",
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  });

app.get('/status', (req, res) => res.send('Working!'));

// app.use("/api", [
//   require("./routes/auth_routes"),
//   require("./routes/user_routes"),
//   require("./routes/project_routes"),
// ]);

// app.use(require("./middleware/error_middleware").all);
const key = fs.readFileSync(__dirname + "/certificates/selfsigned.key");
const cert = fs.readFileSync(__dirname + "/certificates/selfsigned.crt");
const options = {
  key: key,
  cert: cert,
};

if (process.env.PROD_ENV === "development") {
  var server = http.createServer(app);
  server.listen(port, () => {
    console.log("server starting on port http : " + port);
  });
} else {
  var server = https.createServer(options, app);
  server.listen(port, () => {
    console.log("server starting on port https: " + port);
  });
}

module.exports = app;
