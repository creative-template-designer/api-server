const mysql = require("mysql");

// Database Connection for Production

let config = {
  user: process.env.SQL_USER,
  database: process.env.DB_DATABASE,
  password: process.env.SQL_PASSWORD,
};

if (
  process.env.INSTANCE_CONNECTION_NAME &&
  process.env.NODE_ENV === "production"
) {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
    config.host = process.env.HOST;
}
console.log(config);

let connection = mysql.createConnection(config);

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as thread id: " + connection.threadId);
});

module.exports = connection;
