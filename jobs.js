require("env-yaml").config();
const scheduler = require("@google-cloud/scheduler");
const jobConfig = require("./jobConfig");

const createJobs = async () => {
  const client = new scheduler.CloudSchedulerClient();
  const parent = client.locationPath(
    process.env.PROJECT_ID,
    process.env.LOCATION_ID
  );

  return await Promise.all(
    jobConfig.forEach(payload => {
      return new Promise(async (resolve, reject) => {
        try {
          const job = {
            httpTarget: {
              httpMethod: "POST",
              uri: process.env.API,
              body: Buffer.from(JSON.stringify(payload.data))
            },
            schedule: payload.schedule,
            timeZone: "Jamaica",
            retryConfig: {
              retryCount: 5
            },
            description: payload.description
          };

          if (payload.name) {
            job.name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION_ID}/jobs/${payload.name}`;
          }

          const request = {
            job: job,
            parent: parent
          };

          const response = await client.createJob(request);

          console.log(
            `Returning response from createCommercialInvoiceReminder: ${JSON.stringify(
              response
            )}`
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    })
  );
};

module.exports.createJobs = createJobs;
