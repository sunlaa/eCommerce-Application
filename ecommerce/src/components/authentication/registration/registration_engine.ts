import './registration.sass';
import { ADDRESSES_PROPS } from '@/utils/types_variables/variables';
import FormValidation from '../validation_engine';
import RegFormUi from './registration_ui';
import Input from '@/utils/elements/input';
import { BaseAddress, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import Router from '@/utils/services/routing';

export default class RegFormEngine extends RegFormUi {
  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();

    this.regFormEngineStart();
  }

  regFormEngineStart() {
    this.regFormGeneral();
    this.checkboxEngine();
    this.postalPatternChecker();

    return this.sectionRegForm;
  }

  regFormGeneral() {
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

      this.serverHandle().catch((err) => console.log(err));
    });
  }

  async serverHandle() {
    const data = this.getData();

    const shipAddress: BaseAddress = {
      country: data['ship-country'],
      city: data['ship-city'],
      streetName: data['ship-street'],
      postalCode: data['ship-postal'],
    };

    const billAddress: BaseAddress = {
      country: data['bill-country'],
      city: data['bill-city'],
      streetName: data['bill-street'],
      postalCode: data['bill-postal'],
    };

    const error = await sdk.signup({
      email: data.email,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      dateOfBirth: data.date,
    });

    if (error.length !== 0 && this.submit) {
      this.submit.showErrorMessage(error);
      return;
    }

    let actions: MyCustomerUpdateAction[];
    if (data.sameCheckbox) {
      actions = [
        { action: 'addAddress', address: shipAddress },
        { action: 'addAddress', address: shipAddress },
      ];
    } else {
      actions = [
        { action: 'addAddress', address: shipAddress },
        { action: 'addAddress', address: billAddress },
      ];
    }
    await sdk.updateCustomer(actions);

    const addressesID: string[] = await sdk.getAddressesID();

    await sdk.updateCustomer([
      { action: 'addShippingAddressId', addressId: addressesID[0] },
      { action: 'addBillingAddressId', addressId: addressesID[1] },
    ]);

    if (data.defaultCheckbox) {
      await sdk.updateCustomer([
        { action: 'setDefaultShippingAddress', addressId: addressesID[0] },
        { action: 'setDefaultBillingAddress', addressId: addressesID[1] },
      ]);
    }

    Router.navigateTo('main');
    sdk.header.switchToAuthorized();
  }

  checkboxEngine() {
    const billSelect = this.billSelect;
    if (!billSelect) return;
    const checkbox = this.checkbox;
    if (!checkbox) return;

    checkbox.addListener('input', () => {
      this.billInputs.forEach((inputField) => {
        if (checkbox.element.checked) {
          billSelect.element.disabled = true;
          inputField.input.element.disabled = true;
          inputField.input.element.className = '';
          inputField.hideErrorMessage();
        } else {
          inputField.input.removeAttribute('disabled');
          billSelect.element.disabled = false;
        }
      });
    });

    this.billInputsAutoFill(checkbox);
  }

  billInputsAutoFill(checkbox: Input) {
    if (this.shipSelect) {
      this.shipSelect.addListener('change', () => {
        if (checkbox.element.checked && this.billSelect && this.shipSelect) {
          this.billSelect.element.value = this.shipSelect.element.value;
          this.billSelect.element.dispatchEvent(new Event('change'));
        }
      });
    }

    this.shipInputs.forEach((inputField, i) => {
      inputField.input.addListener('input', () => {
        const inputElement = inputField.input;
        if (checkbox.element.checked) {
          this.billInputs[i].input.value = inputElement.value;
        }
      });
    });
  }

  postalPatternChecker() {
    this.setPattern(this.shipSelect, this.shipPostal);
    this.setPattern(this.billSelect, this.billPostal);

    [
      { select: this.shipSelect, postal: this.shipPostal },
      { select: this.billSelect, postal: this.billPostal },
    ].forEach((obj) => {
      if (!obj.select || !obj.postal) return;
      obj.select.addListener('change', () => {
        this.setPattern(obj.select, obj.postal);
      });
    });
  }

  setPattern(select: BaseElement<HTMLSelectElement> | null, postal: HTMLInputElement | null) {
    if (!select) return;
    const value = select.element.value;
    ADDRESSES_PROPS.forEach((prop, i) => {
      if (value === prop.countryCode) {
        if (!postal) return;
        postal.setAttribute('data-pattern', prop.postalPattern);
        postal.setAttribute('data-country', `${i}`);
      }
    });
  }
}
