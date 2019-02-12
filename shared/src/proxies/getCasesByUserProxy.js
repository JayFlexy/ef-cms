exports.getCasesByUser = async ({ applicationContext, userId }) => {
  const userToken = applicationContext.getCurrentUser().userId; //TODO refactor for jwt

  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/cases`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
