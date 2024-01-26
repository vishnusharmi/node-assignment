const mysql = require("mysql");

const connectDatabase = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "signup",
  password: "ts25b9043",
});

connectDatabase.connect(() => {
  console.log("connected database");
});

module.exports = connectDatabase;
