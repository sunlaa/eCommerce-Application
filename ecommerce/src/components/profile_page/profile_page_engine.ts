import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import { Customer } from '@commercetools/platform-sdk';
import ProfilePage from './profile_page_ui';
import BaseElement from '@/utils/elements/basic_element';
import smoothTransitionTo from '@/utils/functions/smooth_transition_to';
import Input from '@/utils/elements/input';

export default class ProfileEngine {
  form: Form;
  isEditing: boolean = false;
  customerData: Customer | null;
  submitBtn: HTMLInputElement | null;
  mainContainer: BaseElement | null;

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
    customerData: Customer
  ) {
    this.customerData = customerData;
    this.mainContainer = mainContainer;
    this.submitBtn = submitBtn;

    this.form.element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.isEditing) {
        this.editingModeOn(paragraphFields);
      } else {
        this.editingModeOff();
      }
    });
  }

  editingModeOn(paragraphFields: Paragraph[]) {
    this.isEditing = true;
    this.submitBtn!.value = TEXT_CONTENT.profileSaveBtn;

    paragraphFields.forEach((instance) => {
      const paragraphField = instance.element;
      if (paragraphField.dataset.name === 'addresses') {
        console.log(paragraphField.dataset.name, 'addr');
      } else {
        let fieldValue = paragraphField.textContent as string;
        if (paragraphField.dataset.type === 'date') fieldValue = paragraphField.dataset.ph as string;

        const inputField = new Input({
          id: paragraphField.dataset.name,
          name: paragraphField.dataset.name,
          type: paragraphField.dataset.type,
          placeholder: paragraphField.dataset.ph,
          value: fieldValue,
        });
        paragraphField.after(inputField.element);
        paragraphField.remove();
      }
    });
  }

  editingModeOff() {
    // console.log('off');
    this.isEditing = false;
    this.submitBtn!.value = TEXT_CONTENT.profileEditBtn;

    // send data to the server
    // show message
    smoothTransitionTo(new ProfilePage(this.mainContainer!), this.mainContainer!);
  }
}
