import { CerebralTest } from 'cerebral/test';
import { isFunction, mapValues } from 'lodash';
import FormData from 'form-data';

import { CASE_CAPTION_POSTFIX } from '../../shared/src/business/entities/Case';
import {
  CATEGORIES,
  CATEGORY_MAP,
  INTERNAL_CATEGORY_MAP,
} from '../../shared/src/business/entities/Document';
import { Document } from '../../shared/src/business/entities/Document';
import { TRIAL_CITIES } from '../../shared/src/business/entities/TrialCities';

import { applicationContext } from '../src/applicationContext';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';

import petitionsClerkBulkAssignsCases from './journey/petitionsClerkBulkAssignsCases';
import petitionsClerkGetsMyInboxCount from './journey/petitionsClerkGetsMyInboxCount';
import petitionsClerkGetsSectionInboxCount from './journey/petitionsClerkGetsSectionInboxCount';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkVerifiesAssignedWorkItem from './journey/petitionsClerkVerifiesAssignedWorkItem';
import petitionsClerkVerifiesUnreadMessage from './journey/petitionsClerkVerifiesUnreadMessage';
import petitionsClerkViewsMyDocumentQC from './journey/petitionsClerkViewsMyDocumentQC';
import petitionsClerkViewsSectionDocumentQC from './journey/petitionsClerkViewsSectionDocumentQC';

import taxPayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerAddNewCaseToTestObj from './journey/taxpayerAddNewCaseToTestObj';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';

const {
  PARTY_TYPES,
  COUNTRY_TYPES,
} = require('../../shared/src/business/entities/contacts/PetitionContact');

let test;

global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === '/document-qc/section/inbox') {
      await test.runSequence('gotoDashboardSequence', {
        box: 'inbox',
        queue: 'section',
        workQueueIsInternal: false,
      });
    }

    if (url === '/document-qc/my/inbox') {
      await test.runSequence('gotoDashboardSequence', {
        box: 'inbox',
        queue: 'my',
        workQueueIsInternal: false,
      });
    }

    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }

    if (url === '/') {
      await test.runSequence('gotoDashboardSequence');
    }
  },
};

presenter.state = mapValues(presenter.state, value => {
  if (isFunction(value)) {
    return withAppContextDecorator(value, applicationContext);
  }
  return value;
});

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Document QC Journey', () => {
  beforeEach(() => {
    jest.setTimeout(300000);
    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX,
      CATEGORIES,
      CATEGORY_MAP,
      COUNTRY_TYPES,
      DOCUMENT_TYPES_MAP: Document.initialDocumentTypes,
      INTERNAL_CATEGORY_MAP,
      PARTY_TYPES,
      TRIAL_CITIES,
    });
  });
  const caseCreationCount = 3;

  taxpayerLogin(test);

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    taxpayerNavigatesToCreateCase(test);
    taxpayerChoosesProcedureType(test);
    taxpayerChoosesCaseType(test);
    taxpayerCreatesNewCase(test, fakeFile);
    taxpayerAddNewCaseToTestObj(test);
  }

  taxPayerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsSectionDocumentQC(test);
  petitionsClerkGetsSectionInboxCount(test);
  petitionsClerkBulkAssignsCases(test);
  petitionsClerkViewsMyDocumentQC(test);
  petitionsClerkGetsMyInboxCount(test);
  petitionsClerkGetsMyInboxCount(test);
  petitionsClerkVerifiesAssignedWorkItem(test);
  petitionsClerkVerifiesUnreadMessage(test);
});
