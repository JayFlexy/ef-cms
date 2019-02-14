import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import setValidationErrorsAction from '../actions/setValidationErrorsAction';
import shouldValidateAction from '../actions/shouldValidateAction';
import validatePetitionAction from '../actions/validatePetitionAction';

export default [
  shouldValidateAction,
  {
    validate: [
      validatePetitionAction,
      {
        success: [],
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
      },
    ],
  },
];
