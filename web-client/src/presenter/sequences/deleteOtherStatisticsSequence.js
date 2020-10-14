import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { deleteOtherStatisticsAction } from '../actions/deleteOtherStatisticsAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const deleteOtherStatisticsSequence = [
  showProgressSequenceDecorator([
    deleteOtherStatisticsAction,
    {
      error: [],
      success: [
        clearFormAction,
        setSaveAlertsForNavigationAction,
        setCaseDetailPageTabFrozenAction,
        setAlertSuccessAction,
        clearModalAction,
        navigateToCaseDetailCaseInformationActionFactory(),
      ],
    },
  ]),
];
