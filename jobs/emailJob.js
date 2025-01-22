module.exports = (agenda) => {
  agenda.define(
    "send email",
    {
      priority: "high",
      concurrency: 5,
      attempts: 3, // Retry job 3 times in case of failure
      backoff: {
        // Retry logic
        type: "exponential", // Exponential backoff for retries
        delay: 10000, // 10-second initial delay between retries
      },
    },
    async (job) => {
      // Initialize retry count if it's not set
      if (!job.attrs.retryCount) {
        job.attrs.retryCount = 0;
      }

      const { email, subject, message } = job.attrs.data;
      console.log(`Sending email to: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);

      try {
        // Simulate email sending failure
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.5) {
              console.log("❌ Failed to send email");
              reject(new Error("Email sending failed"));
            } else {
              console.log("✅ Email sent!");
              resolve();
            }
          }, 2000);
        });
      } catch (error) {
        job.attrs.retryCount += 1;

        const retryDelay = Math.pow(2, job.attrs.retryCount) * 10000;

        console.log(
          `Job failed (attempt ${job.attrs.retryCount}), retrying...`
        );
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);

        // Re-schedule job with the new delay
        await job.agenda.schedule(
          new Date(Date.now() + retryDelay),
          job.attrs.name,
          job.attrs.data
        );

        throw error; // Agenda will retry automatically
      }
    }
  );
};
