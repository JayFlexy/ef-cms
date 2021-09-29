import { docketRecordHelper } from './docketRecordHelper';
import { runCompute } from 'cerebral/test';

describe('docket record helper', () => {
  it('should show links for editing docket entries if user does have EDIT_DOCKET_ENTRY permission', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {
          isStatusNew: false,
        },
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: true,
        },
      },
    });
    expect(result.showEditDocketRecordEntry).toBe(true);
  });

  it('should not show links for editing docket entries if user does not have EDIT_DOCKET_ENTRY permission', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {
          isStatusNew: false,
        },
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: false,
        },
      },
    });
    expect(result.showEditDocketRecordEntry).toBe(false);
  });

  it('should show printable docket record button if the case status is not new', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {
          isStatusNew: false,
        },
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: true,
        },
      },
    });
    expect(result.showPrintableDocketRecord).toBe(true);
  });

  it('should not show printable docket record button if the case status is new', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {
          isStatusNew: true,
        },
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: true,
        },
      },
    });
    expect(result.showPrintableDocketRecord).toBe(false);
  });
});
