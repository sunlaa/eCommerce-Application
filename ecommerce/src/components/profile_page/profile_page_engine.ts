import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import ProfilePage from './profile_page_ui';
import Input from '@/utils/elements/input';
import FormValidation from '../authentication/validation_engine';
import ErrorContainer from '@/utils/elements/error_container';
import smoothTransitionTo from '@/utils/functions/smooth_transition';
import Button from '@/utils/elements/button';
import ProfilePasswordManager from './profile_password_manager_ui';
import BaseElement from '@/utils/elements/basic_element';

export default class ProfileEngine {
  validInstance: FormValidation = new FormValidation();

  form: Form;
  isEditing: boolean = false;

  customerData: Customer | null;
  submitBtn: HTMLInputElement | null;
  allInputsArray: HTMLInputElement[] = [];
  passwordForm: Form | null;

  constructor(form: Form) {
    this.form = form;
    this.customerData = null;
    this.submitBtn = null;
    this.passwordForm = null;
  }

  async getCustomerData() {
    const data = await sdk.getCustomerData();

    if (data) return data;
  }

  buttonController(
    submitBtn: HTMLInputElement,
    paragraphFields: Paragraph[],
    errorConts: ErrorContainer[],
    customerData: Customer
  ) {
    this.customerData = customerData;
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
        this.validInstance.validate(inputElement, errorConts[inputIndex]);
      });
    });
  }

  async editingModeOff() {
    let isValidError = false;
    this.allInputsArray.forEach((inputField) => {
      if (this.validInstance.validate(inputField)) isValidError = true;
    });
    if (isValidError) return;

    this.isEditing = false;

    await this.sendingDataToServer();
    // show message
    smoothTransitionTo(new ProfilePage());
  }

  async sendingDataToServer() {
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

    await sdk.updateCustomer(requestBody);
  }

  passwordBtnController(passwordBtn: Button, sumContainer: BaseElement) {
    passwordBtn.addListener('click', () => {
      passwordBtn.remove();

      const passwordManagerInstance = new ProfilePasswordManager(sumContainer);

      passwordManagerInstance.passForm.addListener('submit', (event) => {
        event.preventDefault();
        smoothTransitionTo(new ProfilePage());
      });
      // console.log(passwordManagerInstance.inputFields);
    });
  }
}
