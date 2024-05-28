import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import { Customer } from '@commercetools/platform-sdk';

export default class ProfileEngine {
  form: Form;
  isEditing: boolean = false;
  paragraphFields: Paragraph[] = [];
  customerData: Customer | null;
  submitBtn: HTMLInputElement | null;

  constructor(form: Form) {
    this.form = form;
    this.customerData = null;
    this.submitBtn = null;
  }

  async getCustomerData() {
    const data = await sdk.getCustomerData();

    if (data) return data;
  }

  buttonController(submitBtn: HTMLInputElement, paragraphFields: Paragraph[], customerData: Customer) {
    this.paragraphFields = paragraphFields;
    this.customerData = customerData;
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
    console.log('on');
    this.isEditing = true;
    this.submitBtn!.value = TEXT_CONTENT.profileSaveBtn;
  }

  editingModeOff() {
    console.log('off');
    this.isEditing = false;
    this.submitBtn!.value = TEXT_CONTENT.profileEditBtn;
  }
}
