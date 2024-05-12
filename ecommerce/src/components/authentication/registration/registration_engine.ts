import { ADDRESSES_PROPS, CLASS_NAMES } from '@/utils/types_variables/variables';
import FormValidation from '../validation_engine';
import RegFormUi from './registration_ui';
import { AllFormInputs } from '@/utils/types_variables/types';

export default class RegFormEngine extends RegFormUi {
  container: HTMLElement = document.body; //изменить на main
  formReg: RegFormUi = new RegFormUi();
  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();
  }

  regFormEngineStart() {
    this.formReg.element.setAttribute('novalidate', '');
    this.container.append(this.formReg.element);

    this.regFormGeneral();
    this.checkboxEngine();
    this.postalPatternChecker();
  }

  regFormGeneral() {
    const regBtn = this.formReg.getSubmitBtn()!.querySelector('input');
    if (!regBtn) return;

    regBtn.addEventListener('click', () => {
      this.validInstance.validate(this.formReg);
    });

    this.formReg.element.addEventListener('submit', (event) => {
      event.preventDefault();
      // send data
    });
  }

  checkboxEngine() {
    const billAddressCont = this.formReg.element.querySelector(`.${CLASS_NAMES.regFormAdressBill}`) as HTMLElement;
    const selectBillInput = billAddressCont.querySelector('select') as HTMLSelectElement;
    const billAddressInputs = [...billAddressCont.querySelectorAll('input'), selectBillInput];

    const shipAddressCont = this.formReg.element.querySelector(`.${CLASS_NAMES.regFormAdressShip}`) as HTMLElement;
    const selectShipInput = shipAddressCont.querySelector('select') as HTMLSelectElement;
    const shipAddressInputs = [...shipAddressCont.querySelectorAll('input'), selectShipInput];

    const checkbox = this.formReg.getCheckBox()!.querySelector('input');
    if (!checkbox) return;

    checkbox.addEventListener('input', (event) => {
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

  billInputsAutoFill(checkbox: HTMLInputElement, billAddressInputs: AllFormInputs, shipAddressInputs: AllFormInputs) {
    shipAddressInputs.forEach((element, elementIndex) => {
      element.addEventListener('input', (event) => {
        const inputElement = event.target as HTMLInputElement;
        if (checkbox.checked) {
          billAddressInputs[elementIndex].value = inputElement.value;
        }
      });
    });
  }

  postalPatternChecker() {
    this.formReg.element.querySelectorAll('select').forEach((currentSelect, currentIndex) => {
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

    const postalField = this.formReg.element.querySelector(
      `#${CLASS_NAMES.regAddressClasses[currentIndex].regAddressNames[3]}`
    );

    if (postalPattern && postalField && postalIndex) {
      postalField.setAttribute('data-pattern', postalPattern);
      postalField.setAttribute('data-country', postalIndex);
    }
  }
}
