import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import { Customer } from '@commercetools/platform-sdk';
import ProfilePage from './profile_page_ui';
import BaseElement from '@/utils/elements/basic_element';
import smoothTransitionTo from '@/utils/functions/smooth_transition_to';

export default class ProfileEngine {
  form: Form;
  isEditing: boolean = false;
  paragraphFields: Paragraph[] = [];
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
    this.paragraphFields = paragraphFields;
    this.customerData = customerData;
    this.mainContainer = mainContainer;
    this.submitBtn = submitBtn;

    this.form.element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.isEditing) {
        this.editingModeOn();
      } else {
        this.editingModeOff();
      }
    });
  }

  editingModeOn() {
    // console.log('on');
    this.isEditing = true;
    this.submitBtn!.value = TEXT_CONTENT.profileSaveBtn;
  }

  editingModeOff() {
    // console.log('off');
    this.isEditing = false;
    this.submitBtn!.value = TEXT_CONTENT.profileEditBtn;

    smoothTransitionTo(new ProfilePage(this.mainContainer!), this.mainContainer!);
  }
}
