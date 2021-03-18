const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Javi27Oct85",
  database: "Employee_DB"
});

//Connect to database
connection.connect();
connection.query = util.promisify(connection.query);

module.exports = connection;

