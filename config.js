// @ts-check

const config = {
  endpoint: "https://whenfestival.documents.azure.com:443/",
  key: process.env.DB_KEY,
  databaseId: "whenfestival",
  containerId: "festivals",
  partitionKey: { kind: "Hash", paths: ["/id"] }
};

module.exports = config;
