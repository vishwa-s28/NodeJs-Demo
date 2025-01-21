const emailQueue = require("./jobQueue");

emailQueue.process(async (job) => {
  console.log("Processing job:", job.id);

  const { to, subject, body } = job.data;
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Email sent successfully");
});
