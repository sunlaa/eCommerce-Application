import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Customer } from '@commercetools/platform-sdk';

export default class ProfileEngine {
  form: Form;
  isEditing: boolean = false;

  constructor(form: Form) {
    this.form = form;
  }

  async getCustomerData() {
    const data = await sdk.getCustomerData();

    if (data) return data;
  }

  editingModeOn(editBtn: HTMLInputElement, paragraphFields: Paragraph[], customerData: Customer) {
    // editBtn.addListener('click', () => {
    //   console.log(paragraphFields, customerData);
    // });

    this.form.element.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log(paragraphFields, customerData);
    });
  }
}
