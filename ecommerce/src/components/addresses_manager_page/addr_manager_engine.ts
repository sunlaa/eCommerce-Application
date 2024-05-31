// import Anchor from '@/utils/elements/anchor';
// import Button from '@/utils/elements/button';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import FormValidation from '../authentication/validation_engine';
import Paragraph from '@/utils/elements/paragraph';
import ErrorContainer from '@/utils/elements/error_container';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';
import smoothTransitionTo from '@/utils/functions/smooth_transition';
import AddrManagerPage from './addr_manager_ui';
// import Paragraph from '@/utils/elements/paragraph';
// import { Customer } from '@commercetools/platform-sdk';
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
  validInstance: FormValidation = new FormValidation();

  form: Form;
  isEditing: boolean = false;

  // customerData: Customer | null;
  submitBtn: HTMLInputElement | null;
  // allInputsArray: HTMLInputElement[] = [];
  // passwordForm: Form | null;

  constructor(form: Form) {
    this.form = form;
    // this.customerData = null;
    this.submitBtn = null;
    // this.passwordForm = null;
  }

  buttonController(
    submitBtn: HTMLInputElement,
    deleteBtn: HTMLInputElement,
    paragraphFields: Paragraph[],
    errorConts: ErrorContainer[]
  ) {
    this.submitBtn = submitBtn;

    this.form.addListener('submit', (event) => {
      event.preventDefault();
      if (!this.isEditing) {
        this.editingModeOn(deleteBtn, paragraphFields, errorConts);
      } else {
        void this.editingModeOff();
      }
    });
  }

  editingModeOn(deleteBtn: HTMLInputElement, paragraphFields: Paragraph[], errorConts: ErrorContainer[]) {
    console.log('on');
    console.log(paragraphFields, errorConts);

    this.isEditing = true;
    this.submitBtn!.value = TEXT_CONTENT.profileSaveBtn;
    deleteBtn.remove();

    console.log(this.submitBtn);
  }

  editingModeOff() {
    this.isEditing = false;
    console.log('off');

    smoothTransitionTo(new AddrManagerPage());
  }

  addressRemoving(button: Input) {
    button.addListener('click', () => {
      console.log(this.form.getData());
      smoothTransitionTo(new AddrManagerPage());
    });
  }
}
