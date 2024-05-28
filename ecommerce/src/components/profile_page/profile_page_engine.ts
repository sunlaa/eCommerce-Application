import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import { Customer } from '@commercetools/platform-sdk';
import ProfilePage from './profile_page_ui';
import BaseElement from '@/utils/elements/basic_element';
import smoothTransitionTo from '@/utils/functions/smooth_transition_to';
import Input from '@/utils/elements/input';
import FormValidation from '../authentication/validation_engine';
import ErrorContainer from '@/utils/elements/error_container';

export default class ProfileEngine {
  validInstance: FormValidation = new FormValidation();

  form: Form;
  isEditing: boolean = false;
  customerData: Customer | null;
  submitBtn: HTMLInputElement | null;
  mainContainer: BaseElement | null;
  allInputsArray: HTMLInputElement[] = [];

  constructor(form: Form) {
    this.form = form;
    this.customerData = null;
    this.submitBtn = null;
    this.mainContainer = null;
  }

  async getCustomerData() {
    const data = await sdk.getCustomerData();

    if (data) return data;
  }

  buttonController(
    submitBtn: HTMLInputElement,
    paragraphFields: Paragraph[],
    mainContainer: BaseElement,
    errorConts: ErrorContainer[],
    customerData: Customer
  ) {
    this.customerData = customerData;
    this.mainContainer = mainContainer;
    this.submitBtn = submitBtn;

    this.form.element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.isEditing) {
        this.editingModeOn(paragraphFields, errorConts);
      } else {
        this.editingModeOff();
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

  editingModeOff() {
    let isValidError = false;
    this.allInputsArray.forEach((inputField) => {
      if (this.validInstance.validate(inputField)) isValidError = true;
    });
    if (isValidError) return;

    this.isEditing = false;

    // send data to the server
    // show message
    smoothTransitionTo(new ProfilePage(this.mainContainer!), this.mainContainer!);
  }
}
