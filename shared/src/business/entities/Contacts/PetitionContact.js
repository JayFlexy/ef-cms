const joi = require('joi-browser');

const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

const domesticErrorToMessageMap = {
  countryType: 'Country Type is a required field.',
  name: 'Name is a required field.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: [
    {
      contains: 'match',
      message: 'Please enter a valid zip code.',
    },
    'Zip Code is a required field.',
  ],
  phone: 'Phone is a required field.',
};

const internationalErrorToMessageMap = {
  countryType: 'Country Type is a required field.',
  country: 'Country is a required field.',
  name: 'Name is a required field.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State/Province/Region is a required field.',
  zip: 'Postal Code is a required field.',
  phone: 'Phone is a required field.',
};

const domesticValidationObject = {
  countryType: joi.string().valid(['domestic', 'international']),
  name: joi.string().required(),
  address1: joi.string().required(),
  address2: joi.string().optional(),
  address3: joi.string().optional(),
  city: joi.string().required(),
  state: joi.string().required(),
  zip: joi
    .string()
    .regex(/^\d{5}(-\d{4})?$/)
    .required(),
  phone: joi.string().required(),
};

const internationalValidationObject = {
  country: joi.string().required(),
  name: joi.string().required(),
  address1: joi.string().required(),
  address2: joi.string().optional(),
  address3: joi.string().optional(),
  city: joi.string().required(),
  state: joi.string().optional(),
  zip: joi.string().required(),
  phone: joi.string().required(),
};

exports.DOMESTIC = 'domestic';
exports.INTERNATIONAL = 'international';

exports.PARTY_TYPES = {
  petitioner: 'Petitioner',
  transferee: 'Transferee',
  donar: 'Donor',
  petitionerDeceasedSpouse: 'Petitioner & Deceased Spouse',
  survivingSpouse: 'Surviving Spouse',
  petitionerSpouse: 'Petitioner & Spouse',
  corporation: 'Corporation',
  estateWithoutExecutor:
    'Estate without an Executor/Personal Representative/Fiduciary/etc.',
  partnershipAsTaxMattersPartner: 'Partnership (as the tax matters partner)',
  partnershipOtherThanTaxMatters:
    'Partnership (as a partner other than tax matters partner)',
  nextFriendForMinor:
    'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
  nextFriendForIncomponentPerson:
    'Next Friend for a Legally Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)',
  estate: 'Estate with an Executor/Personal Representative/Fiduciary/etc.',
  partnership: 'Partnership (BBA Regime)',
  trust: 'Trust',
  conservator: 'Conservator',
  guardian: 'Guardian',
  custodian: 'Custodian',
};

exports.getValidationObject = ({ countryType = exports.DOMESTIC }) => {
  return countryType === exports.DOMESTIC
    ? domesticValidationObject
    : internationalValidationObject;
};

exports.getErrorToMessageMap = ({ countryType = exports.DOMESTIC }) => {
  return countryType === exports.DOMESTIC
    ? domesticErrorToMessageMap
    : internationalErrorToMessageMap;
};

const getContactConstructor = ({ partyType, countryType, contactType }) => {
  const {
    getPetitionerTaxpayerContact,
  } = require('./PetitionerTaxpayerContact');
  const {
    getPetitionerConservatorContact,
  } = require('./PetitionerConservatorContact');
  const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');
  const {
    getPetitionerCorporationContact,
  } = require('./PetitionerCorporationContact');
  const {
    getPetitionerIntermediaryContact,
  } = require('./PetitionerIntermediaryContact');
  const {
    getPetitionerDeceasedSpouseContact,
  } = require('./PetitionerDeceasedSpouseContact');
  const { getPetitionerSpouseContact } = require('./PetitionerSpouseContact');
  const {
    getPetitionerEstateExecutorContact,
  } = require('./PetitionerEstateExecutorContact');
  const {
    getPetitionerEstateWithExecutorPrimaryContact,
  } = require('./PetitionerEstateWithExecutorPrimaryContact');
  const {
    getPetitionerGuardianContact,
  } = require('./PetitionerGuardianContact');
  const {
    getPetitionerCustodianContact,
  } = require('./PetitionerCustodianContact');
  const {
    getPetitionerPartnershipRepContact,
  } = require('./PetitionerPartnershipRepContact');
  const { getPetitionerTrustContact } = require('./PetitionerTrustContact');
  const { getPetitionerTrusteeContact } = require('./PetitionerTrusteeContact');
  return {
    [exports.PARTY_TYPES.petitioner]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [exports.PARTY_TYPES.transferee]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [exports.PARTY_TYPES.donar]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [exports.PARTY_TYPES.petitionerDeceasedSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerDeceasedSpouseContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.survivingSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerDeceasedSpouseContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.petitionerSpouse]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerSpouseContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.corporation]: {
      primary: getPetitionerCorporationContact({ countryType }),
      secondary: null,
    }[contactType],
    [exports.PARTY_TYPES.estateWithoutExecutor]: {
      primary: getPetitionerIntermediaryContact({ countryType }),
      secondary: null,
    }[contactType],
    [exports.PARTY_TYPES.partnershipAsTaxMattersPartner]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.partnershipOtherThanTaxMatters]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.nextFriendForMinor]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.nextFriendForIncomponentPerson]: {
      primary: getPetitionerPrimaryContact({ countryType }),
      secondary: getPetitionerIntermediaryContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.estate]: {
      primary: getPetitionerEstateWithExecutorPrimaryContact({ countryType }),
      secondary: getPetitionerEstateExecutorContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.partnership]: {
      primary: getPetitionerIntermediaryContact({ countryType }),
      secondary: getPetitionerPartnershipRepContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.trust]: {
      primary: getPetitionerTrustContact({ countryType }),
      secondary: getPetitionerTrusteeContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.conservator]: {
      primary: getPetitionerTaxpayerContact({ countryType }),
      secondary: getPetitionerConservatorContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.guardian]: {
      primary: getPetitionerGuardianContact({ countryType }),
      secondary: getPetitionerTaxpayerContact({ countryType }),
    }[contactType],
    [exports.PARTY_TYPES.custodian]: {
      primary: getPetitionerCustodianContact({ countryType }),
      secondary: getPetitionerTaxpayerContact({ countryType }),
    }[contactType],
  }[partyType];
};

exports.instantiateContacts = ({ partyType, contactInfo }) => {
  const primaryConstructor = getContactConstructor({
    partyType,
    countryType: (contactInfo.primary || {}).countryType,
    contactType: 'primary',
  });
  const secondaryConstructor = getContactConstructor({
    partyType,
    countryType: (contactInfo.secondary || {}).countryType,
    contactType: 'secondary',
  });
  return {
    primary: primaryConstructor
      ? new primaryConstructor(contactInfo.primary || {})
      : {},
    secondary: secondaryConstructor
      ? new secondaryConstructor(contactInfo.secondary || {})
      : {},
  };
};

exports.createContactFactory = ({
  additionalErrorMappings,
  additionalValidation,
}) => {
  return ({ countryType }) => {
    function GenericContactConstructor(raw) {
      Object.assign(this, raw);
    }

    GenericContactConstructor.errorToMessageMap = {
      ...exports.getErrorToMessageMap({ countryType }),
      ...additionalErrorMappings,
    };

    joiValidationDecorator(
      GenericContactConstructor,
      joi.object().keys({
        ...exports.getValidationObject({ countryType }),
        ...additionalValidation,
      }),
      undefined,
      GenericContactConstructor.errorToMessageMap,
    );

    return GenericContactConstructor;
  };
};
