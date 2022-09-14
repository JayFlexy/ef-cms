const { updateConsistent } = require('../../dynamodbClientService');

/**
 * createJobStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumbers all docket numbers this job needs to process
 * @param {object} providers.jobId the unique jobId for this job
 * @returns {Promise} the promise of the call to persistence
 */
exports.createJobStatus = ({ applicationContext, docketNumbers, jobId }) =>
  updateConsistent({
    ExpressionAttributeNames: {
      '#unfinishedCases': 'unfinishedCases',
    },
    ExpressionAttributeValues: {
      ':unfinishedCases': docketNumbers.length,
    },
    Key: {
      pk: `set-notices-for-trial-session-job-${jobId}`,
      sk: `set-notices-for-trial-session-job-${jobId}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'SET #unfinishedCases = :unfinishedCases',
    applicationContext,
  });
