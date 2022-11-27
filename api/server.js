("use strict");

const bodyParser = require("body-parser");
const http = require("http");
var cors = require("cors");
const https = require("https");
const fs = require("fs");
const { app, createPool } = require("./index.js");

var port = process.env.API_PORT;
const key = fs.readFileSync(__dirname + "/certificates/selfsigned.key");
const cert = fs.readFileSync(__dirname + "/certificates/selfsigned.crt");
const options = {
  key: key,
  cert: cert,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/status", (req, res) => res.send("Working!"));

app.route("/users").get(async function (req, res, next) {
  const pool = await createPool()
    .then(async (pool) => {
      const value = await pool.query("SELECT * FROM users");
      console.log("Ensured that table 'users' exists");
      return value;
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });

  res.send(pool);
});

app.use("/api", [
  require("./server/routes/auth_routes"),
  // require("./server/routes/user_routes"),
  // require("./server/routes/project_routes"),
]);

app.use(require("./server/middleware/error_middleware").all);

var server;
if (process.env.PROD_ENV === "development") {
  server = http.createServer(app);
  server.listen(port, () => {
    console.log("server starting on port http : " + port);
  });
} else {
  server = https.createServer(options, app);
  server.listen(port, () => {
    console.log("server starting on port https: " + port);
  });
}

process.on("unhandledRejection", (err) => {
  console.error(err);
  throw err;
});

module.exports = server;
