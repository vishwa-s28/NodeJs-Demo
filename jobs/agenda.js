const Agenda = require("agenda");
require("dotenv").config();

const mongoConnectionString = process.env.MONGO_URL;
const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "jobs" },
});

module.exports = agenda;
