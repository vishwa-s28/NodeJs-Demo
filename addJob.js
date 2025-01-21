const emailQueue = require("./jobQueue");

const addEmailJob = async (emailData) => {
  await emailQueue.add(
    {
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
    },
    {
      attempts: 3, // Number of retries if the job fails
      backoff: 5000, // Time between retries in ms
    }
  );
};

const emailData = {
  to: "user@example.com",
  subject: "Welcome!",
  body: "Hello, welcome to our service.",
};

addEmailJob(emailData).then(() => {
  console.log("Job added to the queue");
});
