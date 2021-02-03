import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCInboxForUserAction } from './getDocumentQCInboxForUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentQCInboxForUserAction', () => {
  const mockWorkItems = [{ docketEnryId: 1 }, { docketEntryId: 2 }];
  const mockUserId = '35f77d01-df22-479c-b5a9-84edfbc876af';

  beforeAll(() => {
    applicationContext.getUseCases().getCurrentUser.mockReturnValue({
      userId: mockUserId,
    });

    applicationContext
      .getUseCases()
      .getDocumentQCInboxForUserInteractor.mockReturnValue(mockWorkItems);

    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to get the current user', async () => {
    await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(applicationContext.getUseCases().getCurrentUser).toHaveBeenCalled();
  });

  it("should make a call to getDocumentQCInboxForUserInteractor with the current user's userId", async () => {
    await runAction(getDocumentQCInboxForUserAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentQCInboxForUserInteractor.mock
        .calls[0][0],
    ).toMatchObject({ userId: mockUserId });
  });
});
