import { CLASS_NAMES, ERROR_MSG } from '@/utils/types_variables/variables';
import InputField from '@/utils/elements/input_field';

export default class FormValidation {
  validate(inputField: InputField) {
    let errorMessage = '';

    const errorContainer = inputField.errorContainer;
    const inputValue = inputField.input.value;
    const inputName = inputField.input.name;

    if (!inputValue && inputField.input.getAttribute('disabled') === null) {
      errorMessage = ERROR_MSG.general[0];
    }

    switch (inputField.input.type) {
      case 'text': {
        const condNameField = inputName === CLASS_NAMES.regFormInputNames[2];
        const condSurnameField = inputName === CLASS_NAMES.regFormInputNames[3];
        const condShipCity = inputName === CLASS_NAMES.regAddressClasses[0].regAddressNames[1];
        const condBillCity = inputName === CLASS_NAMES.regAddressClasses[1].regAddressNames[1];
        const condShipPostal = inputName === CLASS_NAMES.regAddressClasses[0].regAddressNames[3];
        const condBillPostal = inputName === CLASS_NAMES.regAddressClasses[1].regAddressNames[3];

        if ((condNameField || condSurnameField || condShipCity || condBillCity) && inputValue.match(/[^а-ёa-z]/gi)) {
          errorMessage = ERROR_MSG.general[1];
        }
        if (
          inputValue &&
          (condShipPostal || condBillPostal) &&
          !new RegExp(inputField.input.getDataAttribute('pattern')).test(inputValue)
        ) {
          errorMessage = ERROR_MSG.postal[+inputField.input.getDataAttribute('country')];
        }
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

    if (errorContainer) {
      errorContainer.showMessage(errorMessage);
    }
  }
}
