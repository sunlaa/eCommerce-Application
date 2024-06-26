import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import ProfilePage from './profile_page_ui';
import Input from '@/utils/elements/input';
import FormValidation from '../authentication/validation_engine';
import ErrorContainer from '@/utils/elements/error_container';
import smoothTransitionTo from '@/utils/functions/smooth_transition';
import Button from '@/utils/elements/button';
import ProfilePasswordManager from './profile_password_manager_ui';
import BaseElement from '@/utils/elements/basic_element';
import { notification } from '../general/notification/notification';

export default class ProfileEngine {
  validInstance: FormValidation = new FormValidation();

  form: Form;
  isEditing: boolean = false;

  submitBtn: HTMLInputElement | null;
  allInputsArray: HTMLInputElement[] = [];
  passwordForm: Form | null;

  constructor(form: Form) {
    this.form = form;
    this.submitBtn = null;
    this.passwordForm = null;
  }

  buttonController(submitBtn: HTMLInputElement, paragraphFields: Paragraph[], errorConts: ErrorContainer[]) {
    this.submitBtn = submitBtn;

    this.form.addListener('submit', (event) => {
      event.preventDefault();
      if (!this.isEditing) {
        this.editingModeOn(paragraphFields, errorConts);
      } else {
        void this.editingModeOff();
      }
    });
  }

  editingModeOn(paragraphFields: Paragraph[], errorConts: ErrorContainer[]) {
    this.isEditing = true;
    this.submitBtn!.value = TEXT_CONTENT.profileSaveBtn;

    paragraphFields.forEach((instance) => {
      const paragraphField = instance.element;
      if (paragraphField.dataset.name !== 'addresses') {
        let fieldValue = paragraphField.textContent as string;
        if (paragraphField.dataset.type === 'date') fieldValue = paragraphField.dataset.ph as string;

        const inputField = new Input({
          id: paragraphField.dataset.name,
          name: paragraphField.dataset.name,
          type: paragraphField.dataset.type,
          placeholder: paragraphField.dataset.ph,
          value: fieldValue,
        });
        this.allInputsArray.push(inputField.element);

        paragraphField.after(inputField.element);
        paragraphField.remove();
      }
    });

    this.allInputsArray.forEach((inputElement, inputIndex) => {
      inputElement.addEventListener('input', () => {
        this.validInstance.validate(inputElement, null, errorConts[inputIndex]);
      });
    });
  }

  async editingModeOff() {
    let isValidError = false;
    this.allInputsArray.forEach((inputField) => {
      if (this.validInstance.validate(inputField, null)) isValidError = true;
    });
    if (isValidError) return;

    this.isEditing = false;

    const error = await this.sendingMainDataToServer();

    if (typeof error === 'string') {
      notification.showError(error);
    } else {
      notification.showSuccess(TEXT_CONTENT.successMainInfoEdited);
    }
    smoothTransitionTo(new ProfilePage());
  }

  async sendingMainDataToServer() {
    const data = this.form.getData();
    const requestBody: MyCustomerUpdateAction[] = [
      {
        action: 'setFirstName',
        firstName: data.firstName,
      },
      {
        action: 'setLastName',
        lastName: data.lastName,
      },
      {
        action: 'changeEmail',
        email: data.email,
      },
      {
        action: 'setDateOfBirth',
        dateOfBirth: data.dateOfBirth,
      },
    ];

    return await sdk.updateCustomer(requestBody);
  }

  passwordBtnController(passwordBtn: Button, sumContainer: BaseElement) {
    passwordBtn.addListener('click', () => {
      passwordBtn.remove();

      const passwordManagerInstance = new ProfilePasswordManager(sumContainer);

      passwordManagerInstance.inputFields.forEach((inputField, fieldIndex) => {
        inputField.input.addListener('input', () => {
          switch (fieldIndex) {
            case 1: {
              this.validInstance.validate(inputField, passwordManagerInstance.inputFields[fieldIndex + 1]);
              break;
            }
            case 2: {
              this.validInstance.validate(inputField, passwordManagerInstance.inputFields[fieldIndex - 1]);
              break;
            }
            default: {
              this.validInstance.validate(inputField, null);
              break;
            }
          }
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      passwordManagerInstance.passForm.addListener('submit', async (event) => {
        event.preventDefault();

        let isValidError = false;
        passwordManagerInstance.inputFields.forEach((inputField, fieldIndex) => {
          switch (fieldIndex) {
            case 1: {
              if (this.validInstance.validate(inputField, passwordManagerInstance.inputFields[fieldIndex + 1])) {
                isValidError = true;
              }
              break;
            }
            case 2: {
              if (this.validInstance.validate(inputField, passwordManagerInstance.inputFields[fieldIndex - 1])) {
                isValidError = true;
              }
              break;
            }
            default: {
              if (this.validInstance.validate(inputField, null)) isValidError = true;
              break;
            }
          }
        });

        if (isValidError) return;

        const response = await this.sendingPasswordDataToServer(passwordManagerInstance);
        if (response.error) {
          notification.showError(response.error);
        } else {
          notification.showSuccess(TEXT_CONTENT.successPasswordEdited);
        }

        smoothTransitionTo(new ProfilePage());
      });
    });
  }

  async sendingPasswordDataToServer(passwordManagerInstance: Form) {
    const data = passwordManagerInstance.getData();

    const response = await sdk.updatePassword(data.currentPassword, data.newPassword);

    if (response.email) {
      sdk.logout();
      await sdk.login({ email: response.email, password: data.newPassword });
    }

    return response;
  }
}
