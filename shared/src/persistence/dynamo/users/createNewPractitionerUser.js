const client = require('../../dynamodbClientService');

const updateUserRecords = async ({
  applicationContext,
  updatedUser,
  userId,
}) => {
  await client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      ...updatedUser,
      userId,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.name}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: `${updatedUser.role}|${updatedUser.barNumber}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

  return {
    ...updatedUser,
    userId,
  };
};

exports.createNewPractitionerUser = async ({ applicationContext, user }) => {
  const { userId } = user;

  await applicationContext
    .getCognito()
    .adminCreateUser({
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'email',
          Value: user.email,
        },
        {
          Name: 'custom:role',
          Value: user.role,
        },
        {
          Name: 'name',
          Value: user.name,
        },
        {
          Name: 'custom:userId',
          Value: user.userId,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: user.email,
    })
    .promise();

  const updatedUser = await updateUserRecords({
    applicationContext,
    updatedUser: user,
    userId,
  });

  return updatedUser;
};