import { state } from 'cerebral';

export const setTokenAction = async ({ applicationContext, props, store }) => {
  store.set(state.token, props.token);
  store.set(state.refreshToken, props.refreshToken);
  applicationContext.setCurrentUserToken(props.token);
  await applicationContext.getUseCases().setItem({
    applicationContext,
    key: 'token',
    value: props.token,
  });
};
