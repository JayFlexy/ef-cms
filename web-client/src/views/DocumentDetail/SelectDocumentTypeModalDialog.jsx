import { sequences, state } from 'cerebral';

import { ModalDialog } from '../ModalDialog';
import React from 'react';
import { connect } from '@cerebral/react';

class SelectDocumentTypeModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.preventCancelOnBlur = true;
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Select',
      title: 'Select Document Type',
    };
  }
  renderBody() {
    return (
      <div className="ustc-select-document-modal">
        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.section ? 'usa-input-error' : '')
          }
        >
          <label htmlFor="category">Document Category</label>

          <select
            className="usa-input-inline"
            id="category"
            name="category"
            value={this.props.form.category}
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              // this.props.validateInitialWorkItemMessageSequence();
            }}
          >
            <option value="">- Select -</option>
            {this.props.constants.CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.section}
          </div>
        </div>

        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.assigneeId ? 'usa-input-error' : '')
          }
        >
          <label htmlFor="documentType">Document Type</label>
          <fieldset
            style={{ maxHeight: '200px', overflowY: 'scroll' }}
            className="usa-input-inline"
            id="documentType"
            name="documentType"
            disabled={!this.props.form.category}
            aria-disabled={!this.props.form.category ? 'true' : 'false'}
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              // this.props.validateInitialWorkItemMessageSequence();
            }}
          >
            {this.props.constants.CATEGORY_MAP[this.props.form.category].map(
              documentType => (
                <label
                  key={documentType.documentTitle}
                  htmlFor={`type-${documentType.documentTitle}`}
                >
                  <input
                    type="radio"
                    id={`type-${documentType.documentTitle}`}
                    value={documentType.documentTitle}
                  />
                  {documentType.documentTitle}
                </label>
              ),
            )}
          </fieldset>
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.assigneeId}
          </div>
        </div>
      </div>
    );
  }
}

export const SelectDocumentTypeModalDialog = connect(
  {
    cancelSequence: sequences.dismissCreateMessageModalSequence,
    confirmSequence: sequences.createWorkItemSequence,
    constants: state.constants,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    users: state.users,
    validationErrors: state.validationErrors,
  },
  SelectDocumentTypeModalDialogComponent,
);
