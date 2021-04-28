import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setUserPendingEmailForPrimaryAndSecondaryAction } from './setUserPendingEmailForPrimaryAndSecondaryAction';

describe('setUserPendingEmailForPrimaryAndSecondaryAction', () => {
  const mockEmail = 'error@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.screenMetadata.pendingEmails.primary from props.contactPrimaryPendingEmail', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactPrimaryPendingEmail: mockEmail,
        },
      },
    );

    expect(state.screenMetadata.pendingEmails.primary).toBe(mockEmail);
  });

  it('should set state.screenMetadata.pendingEmails.primary to undefined when props.contactPrimaryPendingEmail is undefined', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactPrimaryPendingEmail: undefined,
        },
      },
    );

    expect(state.screenMetadata.pendingEmails.primary).toBeUndefined();
  });

  it('set state.screenMetadata.pendingEmails.secondary from props.contactSecondaryPendingEmail', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactSecondaryPendingEmail: mockEmail,
        },
      },
    );

    expect(state.screenMetadata.pendingEmails.secondary).toBe(mockEmail);
  });

  it('should set state.screenMetadata.pendingEmails.secondary to undefined when props.contactSecondaryPendingEmail is undefined', async () => {
    const { state } = await runAction(
      setUserPendingEmailForPrimaryAndSecondaryAction,
      {
        props: {
          contactSecondaryPendingEmail: undefined,
        },
      },
    );

    expect(state.screenMetadata.pendingEmails.secondary).toBeUndefined();
  });
});