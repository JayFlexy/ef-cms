import { state } from 'cerebral';

/**
 * submit case association request for a respondent
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitRespondentCaseAssociationRequestAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId } = get(state.caseDetail);
  const user = get(state.user);

  if (user.role === 'respondent') {
    return await applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor({
        applicationContext,
        caseId,
      });
  }
};