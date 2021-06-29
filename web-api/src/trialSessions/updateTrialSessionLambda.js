const { genericHandler } = require('../genericHandler');

/**
 * updates a trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateTrialSessionInteractor(applicationContext, {
        trialSession: JSON.parse(event.body),
      });
  });
