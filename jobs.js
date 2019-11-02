require("env-yaml").config();
const scheduler = require("@google-cloud/scheduler");
const jobConfig = require("./jobConfig");

const createJobs = async () => {
  const client = new scheduler.CloudSchedulerClient();
  const parent = client.locationPath(
    process.env.PROJECT_ID,
    process.env.LOCATION_ID
  );

  await deleteJobs();

  jobConfig.forEach(async payload => {
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
    } catch (e) {
      throw e;
    }
  });
  return true;
};

const listJobs = () => {
  const client = new scheduler.CloudSchedulerClient();
  const parent = client.locationPath(
    process.env.PROJECT_ID,
    process.env.LOCATION_ID
  );
  const request = {
    parent: parent
  };
  return client.listJobs(request);
};

const deleteJobs = async () => {
  const client = new scheduler.CloudSchedulerClient();
  const parent = client.locationPath(
    process.env.PROJECT_ID,
    process.env.LOCATION_ID
  );
  const [jobs] = await listJobs();

  jobs.forEach(async job => {
    try {
      const request = {
        name: job.name
      };
      await client.deleteJob(request);
    } catch (e) {
      throw e;
    }
  });
};

module.exports.createJobs = createJobs;
