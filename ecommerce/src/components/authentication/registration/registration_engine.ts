import './registration.sass';
import { ADDRESSES_PROPS, TEXT_CONTENT } from '@/utils/types_variables/variables';
import FormValidation from '../validation_engine';
import RegFormUi from './registration_ui';
import Input from '@/utils/elements/input';
import { BaseAddress, MyCustomerDraft } from '@commercetools/platform-sdk';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import Router from '@/utils/services/routing';
import { notification } from '@/components/general/notification/notification';

export default class RegFormEngine extends RegFormUi {
  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();
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
        this.validInstance.validate(inputField, null);
      });
    });

    this.regForm.element.addEventListener('submit', (event) => {
      event.preventDefault();

      let isError = false;
      this.regForm.inputFields.forEach((inputField) => {
        if (this.validInstance.validate(inputField, null)) isError = true;
      });

      if (isError) return;

      this.serverHandle().catch((err) => console.log(err));
    });
  }

  async serverHandle() {
    const data = this.getData();

    const signupData: MyCustomerDraft = {
      email: data.email,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      dateOfBirth: data.date,
    };

    const shipAddress: BaseAddress = {
      country: data.shipCountry,
      city: data.shipCity,
      streetName: data.shipStreet,
      postalCode: data.shipPostal,
    };

    const billAddress: BaseAddress = {
      country: data.billCountry,
      city: data.billCity,
      streetName: data.billStreet,
      postalCode: data.billPostal,
    };

    if (data.sameCheckbox) {
      Object.assign(signupData, { addresses: [shipAddress, shipAddress] });
    } else {
      Object.assign(signupData, { addresses: [shipAddress, billAddress] });
    }

    const error = await sdk.signup(signupData);

    if (error.length !== 0 && this.submit) {
      notification.showError(error);
      return;
    }

    const addressesID: string[] = await sdk.getAddressesID();

    await sdk.updateCustomer([
      { action: 'addShippingAddressId', addressId: addressesID[0] },
      { action: 'addBillingAddressId', addressId: addressesID[1] },
    ]);

    if (data.shipDefault) {
      await sdk.updateCustomer([{ action: 'setDefaultShippingAddress', addressId: addressesID[0] }]);
    }
    if (data.billDefault) {
      await sdk.updateCustomer([{ action: 'setDefaultBillingAddress', addressId: addressesID[1] }]);
    }

    Router.navigateTo('main');
    sdk.header.switchToAuthorized();
    notification.showSuccess(TEXT_CONTENT.successReg);
  }

  checkboxEngine() {
    const shipSelect = this.shipSelect;
    if (!shipSelect) return;
    const billSelect = this.billSelect;
    if (!billSelect) return;
    const checkbox = this.checkbox;
    if (!checkbox) return;

    checkbox.addListener('input', () => {
      this.billInputs.forEach((inputField, i) => {
        if (checkbox.element.checked) {
          billSelect.element.disabled = true;
          inputField.input.element.disabled = true;

          inputField.input.value = this.shipInputs[i].input.value;
          billSelect.element.value = shipSelect.element.value;
          billSelect.element.dispatchEvent(new Event('change'));
          inputField.input.element.className = '';

          inputField.errorContainer ? inputField.hideErrorMessage() : null;
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
        this.validInstance.postalReValidation(obj.postal!);
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
