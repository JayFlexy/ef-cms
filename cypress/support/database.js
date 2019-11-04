const AWS = require('aws-sdk');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = 'noop';
AWS.config.secretAccessKey = 'noop';
AWS.config.region = 'us-east-1';

const data = require('../../web-api/storage/fixtures/seed');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

const deleteItem = item => {
  return documentClient.delete({
    Key: {
      pk: item.pk,
      sk: item.sk,
    },
    TableName: 'efcms-local',
  });
};

const clearDatabase = async () => {
  const { Items: items } = await documentClient
    .scan({
      TableName: 'efcms-local',
    })
    .promise();

  await Promise.all(items.map(deleteItem));
};

const seedDatabase = () => {
  return Promise.all(
    data.map(item =>
      documentClient
        .put({
          Item: item,
          TableName: 'efcms-local',
        })
        .promise(),
    ),
  );
};

export const reseedDatabase = async () => {
  await clearDatabase();
  await seedDatabase();
};