import Button from '@/utils/elements/button';
import Form from '@/utils/elements/form';
import Paragraph from '@/utils/elements/paragraph';
import { Customer } from '@commercetools/platform-sdk';
// import Paragraph from '@/utils/elements/paragraph';
// import { sdk } from '@/utils/services/SDK/sdk_manager';
// import { TEXT_CONTENT } from '@/utils/types_variables/variables';
// import { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
// import ProfilePage from './profile_page_ui';
// import Input from '@/utils/elements/input';
// import FormValidation from '../authentication/validation_engine';
// import ErrorContainer from '@/utils/elements/error_container';
// import smoothTransitionTo from '@/utils/functions/smooth_transition';
// import Button from '@/utils/elements/button';
// import ProfilePasswordManager from './profile_password_manager_ui';
// import BaseElement from '@/utils/elements/basic_element';

export default class AddrManagerEngine {
  // validInstance: FormValidation = new FormValidation();

  form: Form;
  // isEditing: boolean = false;

  // customerData: Customer | null;
  // submitBtn: HTMLInputElement | null;
  // allInputsArray: HTMLInputElement[] = [];
  // passwordForm: Form | null;

  constructor(form: Form) {
    this.form = form;
    // this.customerData = null;
    // this.submitBtn = null;
    // this.passwordForm = null;
  }

  buttonController(clickableElements: (Paragraph | Button)[], customerData: Customer) {
    console.log(clickableElements, customerData, this.form);

    clickableElements.forEach((element) => {
      element.addListener('click', (event) => {
        const currentElement = event.target as HTMLElement;
        console.log(currentElement.id);
      });
    });
    // this.customerData = customerData;
    // this.submitBtn = submitBtn;
    // this.form.addListener('submit', (event) => {
    //   event.preventDefault();
    //   if (!this.isEditing) {
    //     this.editingModeOn(paragraphFields, errorConts);
    //   } else {
    //     void this.editingModeOff();
    //   }
    // });
  }
}
