import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import FormValidation from '../authentication/validation_engine';
import Paragraph from '@/utils/elements/paragraph';
import ErrorContainer from '@/utils/elements/error_container';
import { ADDRESSES_PROPS, TEXT_CONTENT } from '@/utils/types_variables/variables';
import smoothTransitionTo from '@/utils/functions/smooth_transition';
import AddrManagerPage from './addr_manager_ui';
import BaseElement from '@/utils/elements/basic_element';
import postalPatternUpdating from '@/utils/functions/postal_pattern_updating';
import InputField from '@/utils/elements/input_field';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { AddresessProps } from '@/utils/types_variables/types';
import { notification } from '../general/notification/notification';

export default class AddrManagerEngine {
  validInstance: FormValidation = new FormValidation();

  form: Form;
  isEditing: boolean = false;

  submitBtn: HTMLInputElement | null;
  allInputsArray: HTMLInputElement[] = [];

  constructor(form: Form) {
    this.form = form;
    this.submitBtn = null;
  }

  buttonController(submitBtn: Input, deleteBtn: Input, paragraphFields: Paragraph[], errorConts: ErrorContainer[]) {
    this.submitBtn = submitBtn.element;

    this.form.addListener('submit', (event) => {
      event.preventDefault();
    });

    submitBtn.addListener('click', () => {
      if (!this.isEditing) {
        this.editingModeOn(deleteBtn, paragraphFields, errorConts);
      } else {
        void this.editingModeOff();
      }
    });
  }

  editingModeOn(deleteBtn: Input, paragraphFields: Paragraph[], errorConts: ErrorContainer[]) {
    this.isEditing = true;
    this.submitBtn!.value = TEXT_CONTENT.profileSaveBtn;
    deleteBtn.remove();

    paragraphFields.forEach((instance) => {
      const paragraphField = instance.element;
      const fieldName = paragraphField.dataset.name as string;
      const formType = this.form.element.dataset.type;
      let inputField: Input | BaseElement | null = null;

      if (paragraphField.dataset.name !== 'country') {
        inputField = new Input({
          id: `${formType}${fieldName[0].toUpperCase()}${fieldName.slice(1)}`,
          name: `${formType}${fieldName[0].toUpperCase()}${fieldName.slice(1)}`,
          type: 'text',
          placeholder: paragraphField.dataset.ph,
          value: paragraphField.textContent as string,
        });

        if (paragraphField.dataset.name === 'postalCode') {
          const select = this.form.element[`${formType}Country` as keyof typeof this.form] as HTMLInputElement;
          const countryIndex = select.dataset.index as string;

          inputField.setAttribute('placeholder', ADDRESSES_PROPS[+countryIndex].postalPH);
          inputField.setAttribute('data-country', countryIndex);
          inputField.setAttribute('data-pattern', ADDRESSES_PROPS[+countryIndex].postalPattern);

          postalPatternUpdating(select, inputField.element as HTMLInputElement, true);
        }

        this.allInputsArray.push(inputField.element as HTMLInputElement);
      } else {
        const selectOptions: BaseElement[] = [];

        let dataIndex = 0;

        ADDRESSES_PROPS.forEach((currentCountry, countryIndex) => {
          const currentOption = new BaseElement<HTMLOptionElement>({
            tag: 'option',
            content: currentCountry.countryName,
            value: currentCountry.countryCode,
          });
          selectOptions.push(currentOption);

          if (paragraphField.textContent === currentCountry.countryName) currentOption.setAttribute('selected', '');
          if (instance.element.textContent === currentCountry.countryName) dataIndex = countryIndex;
        });

        inputField = new BaseElement<HTMLSelectElement>(
          { tag: 'select', name: `${formType}${fieldName[0].toUpperCase()}${fieldName.slice(1)}` },
          ...selectOptions
        );

        const currentInput = inputField.element as HTMLSelectElement;
        currentInput.setAttribute('data-index', `${dataIndex}`);
      }

      if (!inputField) return;
      paragraphField.after(inputField.element);
      paragraphField.remove();
    });

    this.allInputsArray.forEach((inputElement, inputIndex) => {
      inputElement.addEventListener('input', () => {
        this.validInstance.validate(inputElement, null, errorConts[inputIndex]);
      });
    });

    const defaultCheckBox = this.form.element.defaultCheckBox as HTMLInputElement;
    defaultCheckBox.removeAttribute('disabled');
  }

  async editingModeOff() {
    let isValidError = false;
    this.allInputsArray.forEach((inputField) => {
      if (this.validInstance.validate(inputField, null)) isValidError = true;
    });
    if (isValidError) return;

    this.isEditing = false;

    const error = await this.changeAddressToServer();
    if (typeof error === 'string') {
      notification.showError(error);
    } else {
      notification.showSuccess(TEXT_CONTENT.successAddressEdited);
    }

    smoothTransitionTo(new AddrManagerPage());
  }

  addressAdding(submitBtn: Input, allInputsArray: InputField[]) {
    this.form.addListener('submit', (event) => {
      event.preventDefault();
    });

    allInputsArray.forEach((inputElement) => {
      inputElement.addListener('input', () => {
        this.validInstance.validate(inputElement, null);
      });
    });

    submitBtn.addListener('click', () => {
      let isValidError = false;
      allInputsArray.forEach((inputElement) => {
        if (this.validInstance.validate(inputElement, null)) isValidError = true;
      });
      if (isValidError) return;

      this.isEditing = false;

      void this.addAddressToServer();
    });
  }

  async addAddressToServer() {
    const data = this.form.getData();
    const city = data.shipCity || data.billCity;
    const country = data.shipCountry || data.billCountry;
    const postalCode = data.shipPostalCode || data.billPostalCode;
    const streetName = data.shipStreetName || data.billStreetName;
    const formType = this.form.getAttribute('data-type') as string;

    const requestBody: MyCustomerUpdateAction[] = [
      {
        action: 'addAddress',
        address: {
          streetName: streetName,
          postalCode: postalCode,
          city: city,
          country: country,
        },
      },
    ];

    const response = await sdk.updateCustomer(requestBody);
    if (typeof response === 'string') {
      notification.showError(response);
      return;
    }

    const allAddresses = response!['addresses'] as AddresessProps[];

    if (formType === 'ship') {
      await this.addShippingAddress(allAddresses[allAddresses.length - 1].id!);
    } else {
      await this.addBillingAddress(allAddresses[allAddresses.length - 1].id!);
    }

    const error = await this.defaultCheckBoxController(formType, allAddresses[allAddresses.length - 1].id!);
    if (typeof error === 'string') {
      notification.showError(error);
    } else {
      notification.showSuccess(TEXT_CONTENT.successAddressAdded);
    }

    smoothTransitionTo(new AddrManagerPage());
  }

  async addShippingAddress(id: string) {
    const requestBody: MyCustomerUpdateAction[] = [
      {
        action: 'addShippingAddressId',
        addressId: id,
      },
    ];

    await sdk.updateCustomer(requestBody);
  }

  async addBillingAddress(id: string) {
    const requestBody: MyCustomerUpdateAction[] = [
      {
        action: 'addBillingAddressId',
        addressId: id,
      },
    ];

    await sdk.updateCustomer(requestBody);
  }

  async changeAddressToServer() {
    const data = this.form.getData();
    const city = data.shipCity || data.billCity;
    const country = data.shipCountry || data.billCountry;
    const postalCode = data.shipPostalCode || data.billPostalCode;
    const streetName = data.shipStreetName || data.billStreetName;
    const formType = this.form.getAttribute('data-type') as string;

    const requestBody: MyCustomerUpdateAction[] = [
      {
        action: 'changeAddress',
        addressId: data.addressId,
        address: {
          streetName: streetName,
          postalCode: postalCode,
          city: city,
          country: country,
        },
      },
    ];

    const error = await sdk.updateCustomer(requestBody);

    if (typeof error === 'string') {
      notification.showError(error);
      return;
    }

    return await this.defaultCheckBoxController(formType, data.addressId);
  }

  async defaultCheckBoxController(formType: string, addressId: string) {
    let response;

    if ((this.form.element.defaultCheckBox as HTMLInputElement).checked && formType === 'ship') {
      response = await this.defaultShippingAddress(addressId);
    } else if ((this.form.element.defaultCheckBox as HTMLInputElement).checked && formType === 'bill') {
      response = await this.defaultBillingAddress(addressId);
    }

    return response;
  }

  async defaultShippingAddress(id: string) {
    const requestBody: MyCustomerUpdateAction[] = [
      {
        action: 'setDefaultShippingAddress',
        addressId: id,
      },
    ];

    return await sdk.updateCustomer(requestBody);
  }

  async defaultBillingAddress(id: string) {
    const requestBody: MyCustomerUpdateAction[] = [
      {
        action: 'setDefaultBillingAddress',
        addressId: id,
      },
    ];

    return await sdk.updateCustomer(requestBody);
  }

  addressRemoving(button: Input) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    button.addListener('click', async () => {
      const requestBody: MyCustomerUpdateAction[] = [
        {
          action: 'removeAddress',
          addressId: this.form.getData().addressId,
        },
      ];

      const error = await sdk.updateCustomer(requestBody);
      if (typeof error === 'string') {
        notification.showError(error);
      } else {
        notification.showSuccess(TEXT_CONTENT.successAddressRemoved);
      }

      smoothTransitionTo(new AddrManagerPage());
    });
  }
}
