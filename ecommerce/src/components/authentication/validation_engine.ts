import ErrorContainer from '@/utils/elements/error_container';
import { CLASS_NAMES, ERROR_MSG } from '../../utils/types_variables/variables';
import InputField from '@/utils/elements/input_field';

export default class FormValidation {
  validate(inputField: InputField | HTMLInputElement, errorCont?: ErrorContainer) {
    let errorMessage = '';
    let inputElement;
    let errorContainer;

    if (!(inputField instanceof InputField)) {
      inputElement = inputField;
      errorContainer = errorCont;
    } else {
      inputElement = inputField.input.element;
      errorContainer = inputField.errorContainer;
    }

    const inputValue = inputElement.value;
    const inputName = inputElement.name;

    if (!inputValue && inputElement.getAttribute('disabled') === null) {
      errorMessage = ERROR_MSG.general[0];
    }

    switch (inputElement.type) {
      case 'text': {
        const isEmailField =
          inputName === CLASS_NAMES.regFormInputNames[0] || inputName === CLASS_NAMES.login.emailInput;
        const isPasswordField = inputName === CLASS_NAMES.regFormInputNames[1];
        const isNameField = inputName === CLASS_NAMES.regFormInputNames[2];
        const isProfileNameField = inputName === 'firstName';
        const isSurnameField = inputName === CLASS_NAMES.regFormInputNames[3];
        const isProfileSurnameField = inputName === 'lastName';
        const isShipCity = inputName === CLASS_NAMES.regAddressClasses[0].regAddressNames[1];
        const isBillCity = inputName === CLASS_NAMES.regAddressClasses[1].regAddressNames[1];
        const isShipPostal = inputName === CLASS_NAMES.regAddressClasses[0].regAddressNames[3];
        const isBillPostal = inputName === CLASS_NAMES.regAddressClasses[1].regAddressNames[3];

        if (
          (isNameField || isProfileNameField || isSurnameField || isProfileSurnameField || isShipCity || isBillCity) &&
          inputValue.match(/[^а-ёa-z]/gi)
        ) {
          errorMessage = ERROR_MSG.general[1];
        }
        if (
          inputValue &&
          (isShipPostal || isBillPostal) &&
          !new RegExp(inputElement.getAttribute('pattern')!).test(inputValue)
        ) {
          errorMessage = ERROR_MSG.postal[+inputElement.getAttribute('country')!];
        }

        // password type=text validation
        if (isPasswordField && inputValue) errorMessage = this.passwordValidation(inputValue);

        // email validation
        if (isEmailField && inputValue && !inputValue.includes('@')) {
          errorMessage = ERROR_MSG.email[0];
        } else if (isEmailField && inputValue && !inputValue.split('@')[0]) {
          errorMessage = ERROR_MSG.email[1];
        } else if (isEmailField && inputValue && !inputValue.split('@')[1]) {
          errorMessage = ERROR_MSG.email[2];
        } else if (
          isEmailField &&
          inputValue &&
          (!inputValue.includes('.') || !inputValue.split('.')[1] || !inputValue.split('@')[1].split('.')[0])
        ) {
          errorMessage = ERROR_MSG.email[3];
        } else if (isEmailField && inputValue.match(/[!#%*&~`'":;,=№<>+?^${}()|[\]\\]/g)) {
          errorMessage = ERROR_MSG.email[4];
        }

        if (isEmailField && inputValue.match(/[А-яЁё]/g)) errorMessage = ERROR_MSG.email[5];
        if (isEmailField && inputValue.includes(' ')) errorMessage = ERROR_MSG.email[6];
        break;
      }
      case 'password': {
        if (inputValue) errorMessage = this.passwordValidation(inputValue);
        break;
      }
      case 'date': {
        const refDate = new Date(new Date().setFullYear(new Date().getFullYear() - 13));
        const currentDate = new Date(inputValue);

        if (currentDate.getFullYear() < 1900 || currentDate.getFullYear() > new Date().getFullYear()) {
          errorMessage = ERROR_MSG.date[0];
        } else if (refDate.valueOf() - currentDate.valueOf() < 0) {
          errorMessage = ERROR_MSG.date[1];
        }
        break;
      }
      default: {
        break;
      }
    }

    if (errorContainer && !inputElement.disabled) {
      errorContainer.showMessage(errorMessage);
    }

    inputElement.className = '';
    if (errorMessage && inputElement.getAttribute('disabled') === null) {
      inputElement.classList.add(CLASS_NAMES.inputInvalid);
    } else if (!errorMessage && inputElement.getAttribute('disabled') === null) {
      inputElement.classList.add(CLASS_NAMES.inputValid);
    }
    return errorMessage;
  }

  passwordValidation(inputValue: string) {
    let errorMessage = '';

    if (inputValue.length < 8) {
      errorMessage = ERROR_MSG.password[0];
    } else if (!inputValue.match(/[A-Z]/g)) {
      errorMessage = ERROR_MSG.password[1];
    } else if (!inputValue.match(/[a-z]/g)) {
      errorMessage = ERROR_MSG.password[2];
    } else if (!inputValue.match(/[0-9]/g)) {
      errorMessage = ERROR_MSG.password[3];
    }

    if (inputValue.includes(' ')) errorMessage = ERROR_MSG.password[4];
    return errorMessage;
  }
}
