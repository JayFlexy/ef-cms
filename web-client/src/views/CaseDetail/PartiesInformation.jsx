import { AddPrivatePractitionerModal } from './AddPrivatePractitionerModal';
import { Button } from '../../ustc-ui/Button/Button';
import { ParticipantsAndCounsel } from './ParticipantsAndCounsel';
import { PetitionersAndCounsel } from './PetitionersAndCounsel';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { RespondentCounsel } from './RespondentCounsel';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect(
  {
    partiesInformationHelper: state.partiesInformationHelper,
    partyViewTabs: state.constants.PARTY_VIEW_TABS,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function PartiesInformation({
    partiesInformationHelper,
    partyViewTabs,
    screenMetadata,
    showModal,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        <div className="grid-row grid-gap">
          <div className="grid-col-3">
            <div className="border border-base-lighter">
              <div className="grid-row padding-left-205 grid-header">
                Parties & Counsel
              </div>
              <div className="">
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                    screenMetadata.partyViewTab ===
                      partyViewTabs.petitionersAndCounsel && 'active',
                  )}
                  onClick={() => {
                    updateScreenMetadataSequence({
                      key: 'partyViewTab',
                      value: partyViewTabs.petitionersAndCounsel,
                    });
                  }}
                >
                  <div className="grid-row margin-left-205">
                    {partyViewTabs.petitionersAndCounsel}
                  </div>
                </Button>
                {partiesInformationHelper.showParticipantsTab && (
                  <Button
                    className={classNames(
                      'usa-button--unstyled attachment-viewer-button',
                      screenMetadata.partyViewTab ===
                        partyViewTabs.participantsAndCounsel && 'active',
                    )}
                    onClick={() => {
                      updateScreenMetadataSequence({
                        key: 'partyViewTab',
                        value: partyViewTabs.participantsAndCounsel,
                      });
                    }}
                  >
                    <div className="grid-row margin-left-205">
                      {partyViewTabs.participantsAndCounsel}
                    </div>
                  </Button>
                )}
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                    screenMetadata.partyViewTab ===
                      partyViewTabs.respondentCounsel && 'active',
                  )}
                  onClick={() => {
                    updateScreenMetadataSequence({
                      key: 'partyViewTab',
                      value: partyViewTabs.respondentCounsel,
                    });
                  }}
                >
                  <div className="grid-row margin-left-205">
                    {partyViewTabs.respondentCounsel}
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid-col-9">
            {screenMetadata.partyViewTab ===
              partyViewTabs.petitionersAndCounsel && <PetitionersAndCounsel />}
            {screenMetadata.partyViewTab ===
              partyViewTabs.participantsAndCounsel && (
              <ParticipantsAndCounsel />
            )}
            {screenMetadata.partyViewTab ===
              partyViewTabs.respondentCounsel && <RespondentCounsel />}
          </div>
        </div>
        {showModal === 'AddPrivatePractitionerModal' && (
          <AddPrivatePractitionerModal />
        )}
        {showModal === 'PractitionerExistsModal' && <PractitionerExistsModal />}
      </>
    );
  },
);

export { PartiesInformation };