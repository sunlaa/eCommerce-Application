import { CLASS_NAMES, ERROR_MSG } from '@/utils/types_variables/variables';
import RegFormUi from './registration/registration_ui';

export default class FormValidation {
  validate(formInstance: RegFormUi) {
    // const form = formInstance.element;
    // const allInputs = form.querySelectorAll('input');
    const allInputs = formInstance.allInputs;

    allInputs.forEach((input) => {
      // if (input.type === 'checkbox' || input.type === 'submit') return;

      const errorContainer = input.nextSibling as HTMLParagraphElement;
      let errorMessage = '';

      const inputValue = input.value;
      if (!inputValue && input.getAttribute('disabled') === null) {
        errorMessage = ERROR_MSG.general[0];
      }

      switch (input.type) {
        case 'text': {
          if (
            input.name === CLASS_NAMES.regFormInputNames[2] ||
            input.name === CLASS_NAMES.regFormInputNames[3] ||
            input.name === CLASS_NAMES.regAddressClasses[0].regAddressNames[1] ||
            input.name === CLASS_NAMES.regAddressClasses[1].regAddressNames[1]
          ) {
            if (inputValue.match(/[^а-ёa-z]/gi)) errorMessage = ERROR_MSG.general[1];
          }
          // switch (input.name) {
          //   case '': {
          //     break;
          //   }
          //   default: {
          //     break;
          //   }
          // }
          break;
        }
        case 'email': {
          if (inputValue && !inputValue.includes('@')) {
            errorMessage = ERROR_MSG.email[0];
          } else if (inputValue && !inputValue.split('@')[1]) {
            errorMessage = ERROR_MSG.email[1];
          } else if (inputValue && (!inputValue.includes('.') || !inputValue.split('.')[1])) {
            errorMessage = ERROR_MSG.email[2];
          }

          if (inputValue.match(/[А-яЁё]/g)) errorMessage = ERROR_MSG.email[3];
          if (inputValue.includes(' ')) errorMessage = ERROR_MSG.email[4];
          break;
        }
        case 'password': {
          if (inputValue && inputValue.length < 8) {
            errorMessage = ERROR_MSG.password[0];
          } else if (inputValue && !inputValue.match(/[A-Z]/g)) {
            errorMessage = ERROR_MSG.password[1];
          } else if (inputValue && !inputValue.match(/[a-z]/g)) {
            errorMessage = ERROR_MSG.password[2];
          } else if (inputValue && !inputValue.match(/[0-9]/g)) {
            errorMessage = ERROR_MSG.password[3];
          }

          if (inputValue !== inputValue.trim()) errorMessage = ERROR_MSG.password[4];
          break;
        }
        default: {
          break;
        }
      }
      errorContainer.textContent = errorMessage;
    });
  }
}
