import * as providers from './providers';
import * as sequences from './sequences';

/**
 * Main Cerebral module
 */
export default {
  providers,
  sequences,
  state: {
    currentPage: 'Home',
    user: 'A. Taxpayer',
    usaBanner: {
      showDetails: false,
    },
    alertError: '',
    petition: {
      petitionFile: {
        file: undefined,
        documentId: undefined,
      },
      requestForPlaceOfTrial: {
        file: undefined,
        documentId: undefined,
      },
      statementOfTaxpayerIdentificationNumber: {
        file: undefined,
        documentId: undefined,
      },
    },
  },
};
