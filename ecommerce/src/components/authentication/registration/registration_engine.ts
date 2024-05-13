import { ADDRESSES_PROPS, CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import FormValidation from '../validation_engine';
import RegFormUi from './registration_ui';
import { AllFormInputs } from '@/utils/types_variables/types';
import Input from '@/utils/elements/input';
import BaseElement from '@/utils/elements/basic_element';

export default class RegFormEngine extends RegFormUi {
  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();
  }

  regFormEngineStart() {
    const regFormSection = new BaseElement({ tag: 'section', classes: [CLASS_NAMES.regPageContainer] });
    regFormSection.append(new BaseElement({ tag: 'h2', content: TEXT_CONTENT.titleRegPage }));

    this.formReg.element.setAttribute('novalidate', '');
    regFormSection.append(this.formReg.element);

    this.regFormGeneral();
    this.checkboxEngine();
    this.postalPatternChecker();

    return regFormSection.element;
  }

  regFormGeneral() {
    const regBtn = this.formReg.getSubmitBtn();
    if (!regBtn) return;

    regBtn.addListener('click', () => {
      this.formReg.inputFields.forEach((inputField) => {
        this.validInstance.validate(inputField);
      });
    });

    this.formReg.inputFields.forEach((inputField) => {
      inputField.input.addListener('input', () => {
        this.validInstance.validate(inputField);
      });
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

    const checkbox = this.formReg.getCheckBox();
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
