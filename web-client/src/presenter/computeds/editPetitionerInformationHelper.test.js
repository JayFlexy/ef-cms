import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { editPetitionerInformationHelper as editPetitionerInformationHelperComputed } from './editPetitionerInformationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const editPetitionerInformationHelper = withAppContextDecorator(
  editPetitionerInformationHelperComputed,
  applicationContext,
);

describe('editPetitionerInformationHelper', () => {
  it('returns showLoginAndServiceInformation true if the current user has the EDIT_PETITIONER_EMAIL permission', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: { partyType: PARTY_TYPES.petitioner },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });
    expect(result.showLoginAndServiceInformation).toEqual(true);
  });
  it('returns showLoginAndServiceInformation false if the current user DOES NOT have the EDIT_PETITIONER_EMAIL permission', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: { partyType: PARTY_TYPES.petitioner },
        permissions: {
          EDIT_PETITIONER_EMAIL: false,
        },
      },
    });
    expect(result.showLoginAndServiceInformation).toEqual(false);
  });

  it('should return isElectronicAvailableForPrimary true if the contactPrimary has an email address', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: {
          contactPrimary: {
            email: 'testpetitioner@example.com',
          },
          partyType: PARTY_TYPES.petitioner,
        },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });

    expect(result.isElectronicAvailableForPrimary).toEqual(true);
  });

  it('should return isElectronicAvailableForPrimary false if the contactPrimary DOES NOT have an email address', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: {
          contactPrimary: {},
          partyType: PARTY_TYPES.petitioner,
        },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });

    expect(result.isElectronicAvailableForPrimary).toEqual(false);
  });

  it('should return isElectronicAvailableForSecondary true if the contactPrimary has an email address', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: {
          contactSecondary: {
            email: 'testpetitioner@example.com',
          },
          partyType: PARTY_TYPES.petitionerSpouse,
        },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });

    expect(result.isElectronicAvailableForSecondary).toEqual(true);
  });

  it('should return isElectronicAvailableForSecondary false if the contactPrimary DOES NOT have an email address', () => {
    const result = runCompute(editPetitionerInformationHelper, {
      state: {
        form: {
          contactSecondary: {},
          partyType: PARTY_TYPES.petitionerSpouse,
        },
        permissions: {
          EDIT_PETITIONER_EMAIL: true,
        },
      },
    });

    expect(result.isElectronicAvailableForSecondary).toEqual(false);
  });
  // TODO additional coverage
});
