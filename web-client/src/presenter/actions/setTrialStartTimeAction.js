import { state } from 'cerebral';

/**
 * sets the state.form.startTime values to a default 10:00am value
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setTrialStartTimeAction = ({ props, store }) => {
  store.set(state.form.startTimeExtension, props.startTimeExtension);
  store.set(state.form.startTimeHours, props.startTimeHours);
  store.set(state.form.startTimeMinutes, props.startTimeMinutes);
};
