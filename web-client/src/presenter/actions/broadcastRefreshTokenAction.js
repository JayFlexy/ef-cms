import { state } from 'cerebral';

/**
 * broadcasts our refresh token to listening tabs
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext application context used to get the broadcast gateway
 * @returns {Promise} upon posting of message
 */
export const broadcastRefreshTokenAction = async ({
  applicationContext,
  get,
}) => {
  const refreshToken = get(state.refreshToken);
  const token = get(state.token);
  const broadcastChannel = applicationContext.getBroadcastGateway();
  console.log('broadcasting receiveToken');
  await broadcastChannel.postMessage({
    refreshToken,
    subject: 'receiveToken',
    token,
  });
};
