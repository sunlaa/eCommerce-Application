import { ADDRESSES_PROPS, CLASS_NAMES } from '@/utils/types_variables/variables';
import FormValidation from '../validation_engine';
import RegFormUi from './registration_ui';
import { AllFormInputs } from '@/utils/types_variables/types';
import Input from '@/utils/elements/input';
import SDKManager from '@/utils/services/SDK/sdk_manager';
import { BaseAddress } from '@commercetools/platform-sdk';

export default class RegFormEngine extends RegFormUi {
  validInstance: FormValidation = new FormValidation();

  sdk: SDKManager;

  constructor(sdk: SDKManager) {
    super();
    this.sdk = sdk;
  }

  regFormEngineStart() {
    this.regFormGeneral();
    this.checkboxEngine();
    this.postalPatternChecker();

    return this.sectionRegForm;
  }

  regFormGeneral() {
    const regBtn = this.regForm.getSubmitBtn();
    if (!regBtn) return;

    this.regForm.inputFields.forEach((inputField) => {
      inputField.input.addListener('input', () => {
        this.validInstance.validate(inputField);
      });
    });

    this.regForm.element.addEventListener('submit', (event) => {
      event.preventDefault();

      let isError = false;
      this.regForm.inputFields.forEach((inputField) => {
        if (this.validInstance.validate(inputField)) isError = true;
      });

      if (isError) return;

      const data = this.getData();

      // доставать значение страны из списка

      const shipAddress: BaseAddress = {
        key: 'ship-address',
        country: 'FR',
        city: data['ship-city'],
        streetName: data['ship-street'],
        postalCode: data['ship-postal'],
      };

      const billAddress: BaseAddress = {
        key: 'bill-address',
        country: 'FR',
        city: data['bill-city'],
        streetName: data['bill-street'],
        postalCode: data['bill-postal'],
      };

      this.sdk
        .signup({
          email: data.email,
          password: data.password,
          firstName: data.name,
          lastName: data.surname,
          dateOfBirth: data.date,
          addresses: [shipAddress, billAddress],
        })
        .then(() => {
          // обработка чекбоксов
        })
        .catch((err) => console.log(err));
    });
  }

  checkboxEngine() {
    const billAddressCont = this.regForm.element.querySelector(`.${CLASS_NAMES.regFormAdressBill}`) as HTMLElement;
    const selectBillInput = billAddressCont.querySelector('select') as HTMLSelectElement;
    const billAddressInputs = [...billAddressCont.querySelectorAll('input'), selectBillInput];

    const shipAddressCont = this.regForm.element.querySelector(`.${CLASS_NAMES.regFormAdressShip}`) as HTMLElement;
    const selectShipInput = shipAddressCont.querySelector('select') as HTMLSelectElement;
    const shipAddressInputs = [...shipAddressCont.querySelectorAll('input'), selectShipInput];

    const checkbox = this.regForm.getCheckBox();
    if (!checkbox) return;

    checkbox.addListener('input', (event) => {
      const checkboxElement = event.target as HTMLInputElement;
      billAddressInputs.forEach((billAdressInput, fieldIndex) => {
        if (checkboxElement.checked) {
          billAdressInput.setAttribute('disabled', '');
          billAdressInput.nextSibling!.textContent = '';
          billAdressInput.value = shipAddressInputs[fieldIndex].value;
        } else {
          billAdressInput.removeAttribute('disabled');
        }
      });
    });

    this.billInputsAutoFill(checkbox, billAddressInputs, shipAddressInputs);
  }

  billInputsAutoFill(checkbox: Input, billAddressInputs: AllFormInputs, shipAddressInputs: AllFormInputs) {
    shipAddressInputs.forEach((element, elementIndex) => {
      element.addEventListener('input', (event) => {
        const inputElement = event.target as HTMLInputElement;
        if (checkbox.element.checked) {
          billAddressInputs[elementIndex].value = inputElement.value;
        }
      });
    });
  }

  postalPatternChecker() {
    this.regForm.element.querySelectorAll('select').forEach((currentSelect, currentIndex) => {
      this.postalPatternGen(currentSelect, currentIndex);

      currentSelect.addEventListener('change', (event) => {
        const selectElement = event.target as HTMLSelectElement;
        const selectId = +selectElement.dataset.index!;

        this.postalPatternGen(selectElement, selectId);
      });
    });
  }

  postalPatternGen(currentSelect: HTMLSelectElement, currentIndex: number) {
    let postalPattern;
    let postalIndex;
    ADDRESSES_PROPS.forEach((countryProps, countryIndex) => {
      if (countryProps.countryName === currentSelect.value) {
        postalPattern = countryProps.postalPattern;
        postalIndex = `${countryIndex}`;
      }
    });

    const postalField = this.regForm.element.querySelector(
      `#${CLASS_NAMES.regAddressClasses[currentIndex].regAddressNames[3]}`
    );

    if (postalPattern && postalField && postalIndex) {
      postalField.setAttribute('data-pattern', postalPattern);
      postalField.setAttribute('data-country', postalIndex);
    }
  }
}
