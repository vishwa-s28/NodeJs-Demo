const express = require("express");
const mongoose = require("mongoose");
const agenda = require("./jobs/agenda");
const emailJob = require("./jobs/emailJob");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL);

// Define jobs
emailJob(agenda);

// Start Agenda
(async () => {
  await agenda.start();
  console.log("Agenda started");
})();

// Route to schedule a job
app.post("/schedule-email", async (req, res) => {
  const { email, subject, message, sendAt } = req.body;

  try {
    await agenda.schedule(sendAt, "send email", { email, subject, message });
    res.status(200).send("Email job scheduled successfully");
  } catch (error) {
    console.error("Error scheduling email job:", error);
    res.status(500).send("Failed to schedule email job");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
