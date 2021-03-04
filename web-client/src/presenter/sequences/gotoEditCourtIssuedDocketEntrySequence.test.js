import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoEditCourtIssuedDocketEntrySequence } from './gotoEditCourtIssuedDocketEntrySequence';
import { presenter } from '../presenter-mock';

describe('gotoEditCourtIssuedDocketEntrySequence', () => {
  const mockDocketEntryId = '4e544995-92a9-45e4-af0a-149dd9c24458';
  const mockDocketNumber = '999-99';

  let test;
  let mockDocketEntry;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.sequences = {
      gotoEditCourtIssuedDocketEntrySequence,
    };
    test = CerebralTest(presenter);

    mockDocketEntry = {
      attachments: false,
      certificateOfService: false,
      createdAt: '2019-06-19T17:29:13.120Z',
      docketEntryId: mockDocketEntryId,
      documentTitle: 'Order to do something',
      documentType: 'Order',
      eventCode: 'O',
      filingDate: '2019-06-22T17:29:13.120Z',
      freeText: 'to do something',
      isOnDocketRecord: true,
      lodged: false,
    };

    applicationContext.getUseCases().getCaseInteractor.mockReturnValue({
      ...MOCK_CASE,
      docketEntries: [mockDocketEntry],
      docketNumber: mockDocketNumber,
    });

    applicationContext
      .getUseCases()
      .generateCourtIssuedDocumentTitleInteractor.mockReturnValue(
        'Order to do something',
      );

    applicationContext
      .getUseCases()
      .getUsersInSectionInteractor.mockReturnValue([
        { name: 'Bob Barker', role: ROLES.judge },
        { name: 'Bob Ross', role: ROLES.petitionsClerk },
      ]);
  });

  it('should set up state for editing court issued docket entry', async () => {
    await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });

    expect(test.getState()).toMatchObject({
      docketEntryId: mockDocketEntryId,
      form: {
        ...mockDocketEntry,
        generatedDocumentTitle: 'Order to do something',
      },
      isEditingDocketEntry: true,
      judges: [{ name: 'Bob Barker', role: ROLES.judge }],
    });
  });
});
