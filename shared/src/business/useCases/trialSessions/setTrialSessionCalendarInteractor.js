const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * set trial session calendar
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to set the calendar
 * @returns {Promise} the promise of the updateTrialSession call
 */
exports.setTrialSessionCalendarInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.validate();

  trialSessionEntity.setAsCalendared();

  //get cases that have been manually added so we can set them as calendared
  const manuallyAddedCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  let eligibleCasesLimit = trialSessionEntity.maxCases;

  if (manuallyAddedCases && manuallyAddedCases.length > 0) {
    eligibleCasesLimit -= manuallyAddedCases.length;
  }

  const eligibleCases = await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialSession({
      applicationContext,
      limit: eligibleCasesLimit,
      skPrefix: trialSessionEntity.generateSortKeyPrefix(),
    });

  /**
   * generates a notice of trial session and adds to the case
   *
   * @param {object} caseEntity the case entity
   * @returns {void}
   */
  const setNoticeOfTrialIssuedForCase = async caseEntity => {
    const noticeOfTrialIssued = await applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    // TODO: Add cover sheet

    const newDocumentId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocument({
      applicationContext,
      document: noticeOfTrialIssued,
      documentId: newDocumentId,
    });

    const documentTitle = `Notice of Trial on ${trialSession.startDate} at ${trialSession.startTime}`;

    const noticeDocument = new Document(
      {
        caseId: caseEntity.caseId,
        documentId: newDocumentId,
        documentTitle,
        documentType: Document.NOTICE_OF_TRIAL.documentType,
        eventCode: Document.NOTICE_OF_TRIAL.eventCode,
        filedBy: user.name,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );

    caseEntity.addDocument(noticeDocument);
    caseEntity.setNoticeOfTrialDate();
    // TODO: Set for service
  };

  /**
   * sets a manually added case as calendared with the trial session details
   *
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promise of the updateCase call
   */
  const setManuallyAddedCaseAsCalendared = async caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);

    await setNoticeOfTrialIssuedForCase(caseEntity);

    return applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });
  };

  /**
   * sets an eligible case as calendared and adds it to the trial session calendar
   *
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promises of the updateCase and deleteCaseTrialSortMappingRecords calls
   */
  const setTrialSessionCalendarForEligibleCase = async caseRecord => {
    const { caseId } = caseRecord;
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);
    trialSessionEntity.addCaseToCalendar(caseEntity);

    await setNoticeOfTrialIssuedForCase(caseEntity);

    return Promise.all([
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
      applicationContext
        .getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords({
          applicationContext,
          caseId,
        }),
    ]);
  };

  await Promise.all([
    ...manuallyAddedCases.map(setManuallyAddedCaseAsCalendared),
    ...eligibleCases.map(setTrialSessionCalendarForEligibleCase),
  ]);

  return await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
