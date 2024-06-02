import { ADDRESSES_PROPS, CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import Section from '@/utils/elements/section';
import BaseElement from '@/utils/elements/basic_element';
import './addr_manager.sass';
import Paragraph from '@/utils/elements/paragraph';
import Form from '@/utils/elements/form';
import ErrorContainer from '@/utils/elements/error_container';
import Button from '@/utils/elements/button';
import Label from '@/utils/elements/label';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Address, Customer } from '@commercetools/platform-sdk';
import Input from '@/utils/elements/input';
import InputField from '@/utils/elements/input_field';
import AddrManagerEngine from './addr_manager_engine';
import Anchor from '@/utils/elements/anchor';
import postalPatternUpdating from '@/utils/functions/postal_pattern_updating';

export default class AddrManagerPage extends Section {
  managerContDetailed = new Form({
    classes: [CLASS_NAMES.addrManager.managerContDetailed, CLASS_NAMES.addrManager.managerEmpty],
  });
  managerEngine: AddrManagerEngine = new AddrManagerEngine(this.managerContDetailed);
  customerData: Customer | null;

  paragraphFields: Paragraph[] = [];
  errorConts: ErrorContainer[] = [];

  constructor() {
    super({ classes: [CLASS_NAMES.addrManager.managerPage] });

    this.customerData = null;
    void this.sumLayoutRendering();
  }

  async sumLayoutRendering() {
    this.customerData = await sdk.getCustomerData();
    if (!this.customerData) return;

    const defaultAddresses = [this.customerData.defaultShippingAddressId, this.customerData.defaultBillingAddressId];
    const clickableElements: BaseElement<HTMLElement>[] = [];

    // title and main containers creating
    this.appendChildren(
      new BaseElement({ tag: 'h2', content: TEXT_CONTENT.addrManagerTitle }),
      new Anchor({
        href: 'profile',
        content: TEXT_CONTENT.managerBackBtn,
        classes: [CLASS_NAMES.link, CLASS_NAMES.addrManager.managerBackBtn],
      })
    );
    const managerContMain = new BaseElement({ classes: [CLASS_NAMES.addrManager.managerContMain] });

    // sum container and elements creating

    const managerContSum = new BaseElement({ classes: [CLASS_NAMES.addrManager.managerContSum] });
    const shipAddresses = this.customerData.shippingAddressIds;
    const billAddresses = this.customerData.billingAddressIds;

    const shipAddrCont = new BaseElement({}, new Paragraph(TEXT_CONTENT.profileFields.addresses[0]));
    const billAddrCont = new BaseElement({}, new Paragraph(TEXT_CONTENT.profileFields.addresses[1]));

    const addressFieldCreator = (addrCont: BaseElement, fieldContent: string, id: string, type: string) => {
      const currentAddress = new BaseElement({ content: `${fieldContent}` });
      currentAddress.setAttribute('data-type', type);
      currentAddress.setAttribute('id', id);

      if (defaultAddresses.includes(id)) {
        currentAddress.append(new BaseElement({ tag: 'span', content: TEXT_CONTENT.addressDefault }));
        currentAddress.element.classList.add(CLASS_NAMES.profile.defaultAddress);
        currentAddress.setAttribute('data-is-default', 'true');
      }
      addrCont.appendChildren(currentAddress);
      clickableElements.push(currentAddress);
    };

    this.customerData.addresses.forEach((address) => {
      let countryName = 'Germany';
      if (address.country === 'FR') countryName = 'France';

      const fieldContent = `● ${address.postalCode}, ${countryName}, ${address.city}, ${address.streetName}`;

      if (shipAddresses!.includes(address.id!)) addressFieldCreator(shipAddrCont, fieldContent, address.id!, 'ship');
      if (billAddresses!.includes(address.id!)) addressFieldCreator(billAddrCont, fieldContent, address.id!, 'bill');
    });

    const addShipBtn = new Button({ content: TEXT_CONTENT.managerAddBtn });
    addShipBtn.element.setAttribute('data-type', 'ship');
    shipAddrCont.append(addShipBtn);

    const addBillBtn = new Button({ content: TEXT_CONTENT.managerAddBtn });
    addBillBtn.element.setAttribute('data-type', 'bill');
    billAddrCont.append(addBillBtn);

    clickableElements.push(...[addShipBtn, addBillBtn]);
    managerContSum.appendChildren(shipAddrCont, billAddrCont);

    // detailed container stuff

    this.managerContDetailed.element.setAttribute('novalidate', '');

    const managerPH = new BaseElement({
      tag: 'h3',
      content: TEXT_CONTENT.managerPH,
    });
    this.managerContDetailed.appendChildren(managerPH);

    // elements appending

    managerContMain.appendChildren(managerContSum, this.managerContDetailed);
    this.element.append(managerContMain.element);

    // clickable elements controller

    clickableElements.forEach((element) => {
      element.addListener('click', (event) => {
        this.managerEngine.isEditing = false;

        let currentElement = event.target as HTMLElement;
        if (currentElement.tagName === 'SPAN') currentElement = (event.target as HTMLElement).parentElement!;
        if (currentElement.classList.contains(CLASS_NAMES.addrManager.selectedAddress)) return;
        this.clickableElementsClassnamesClear(clickableElements);

        this.managerContDetailed.removeChildren();
        this.managerContDetailed.setAttribute('data-type', currentElement.dataset.type!);
        currentElement.classList.add(CLASS_NAMES.addrManager.selectedAddress);

        if (currentElement.id) {
          this.detailedLayoutRendering(currentElement.id, currentElement.dataset.isDefault!);
        } else {
          this.newAddressLayoutRendering();
        }

        this.managerContDetailed.element.classList.remove(CLASS_NAMES.addrManager.managerEmpty);
      });
    });
  }

  detailedLayoutRendering(id: string, isDefault: string) {
    let currentAddress: Address;

    this.customerData!.addresses.forEach((address) => {
      if (id === address.id) currentAddress = address;
    });

    this.managerContDetailed.setAttribute('id', id);

    // additional function
    const fieldsIntoArrayPushing = (fieldContent: string, fieldPH: string, prop: string) => {
      const currentField = new Paragraph(fieldContent);
      currentField.element.classList.add(CLASS_NAMES.addrManager.managerContentField);

      currentField.element.setAttribute('data-PH', fieldPH);
      currentField.element.setAttribute('data-name', prop);

      this.paragraphFields.push(currentField);
      return currentField;
    };

    // detailed container elements creating
    TEXT_CONTENT.managerFormNames.forEach((prop, propIndex) => {
      const infoCont = new BaseElement({});

      let fieldContent = currentAddress![prop as keyof typeof currentAddress] as string;
      const fieldPH = TEXT_CONTENT.managerFormLabels[propIndex];

      if (prop === 'country' && currentAddress![prop as keyof typeof currentAddress] === 'FR') {
        fieldContent = 'France';
      } else if (prop === 'country' && currentAddress![prop as keyof typeof currentAddress] === 'DE') {
        fieldContent = 'Germany';
      }

      const errorContainer = new ErrorContainer([CLASS_NAMES.formError]);
      if (prop !== 'country') {
        this.errorConts.push(errorContainer);
      }

      infoCont.appendChildren(
        new Label({ content: TEXT_CONTENT.managerFormLabels[propIndex], htmlFor: prop }),
        fieldsIntoArrayPushing(fieldContent, fieldPH, prop),
        errorContainer
      );

      this.managerContDetailed.append(infoCont);
    });

    // delete and submit button creation
    const submitBtn = new Input({ value: TEXT_CONTENT.managerEditBtn, type: 'submit' });
    const deleteBtn = new Input({
      type: 'button',
      value: TEXT_CONTENT.managerDeleteBtn,
    });
    this.managerEngine.addressRemoving(deleteBtn);

    // detailed container all elements appending
    this.managerContDetailed.appendChildren(
      new InputField([CLASS_NAMES.addrManager.defaultCheckBoxCont], {
        label: { content: TEXT_CONTENT.managerDefaultCheckBox },
        input: {
          name: CLASS_NAMES.addrManager.defaultCheckBoxName,
          type: 'checkbox',
          checked: Boolean(isDefault),
          disabled: true,
        },
      }),
      new InputField([], {
        input: {
          name: TEXT_CONTENT.hiddenInputName,
          type: 'hidden',
          value: id,
        },
      }),
      new BaseElement({ classes: [CLASS_NAMES.addrManager.managerBtnsCont] }, submitBtn, deleteBtn)
    );

    this.managerEngine.buttonController(submitBtn, deleteBtn, this.paragraphFields, this.errorConts);
    this.paragraphFields = [];
    this.errorConts = [];
  }

  newAddressLayoutRendering() {
    this.managerContDetailed.removeAttribute('id');

    const formType = this.managerContDetailed.element.dataset.type;
    const allInputsArray: InputField[] = [];

    let tempFormType = formType;
    if (formType === 'ship') tempFormType = 'shipp';

    this.managerContDetailed.append(
      new BaseElement({
        tag: 'h3',
        classes: [CLASS_NAMES.addrManager.managerNewAddTitle],
        content: `Adding new ${tempFormType}ing address`,
      })
    );
    TEXT_CONTENT.managerFormNames.forEach((inputName, nameIndex) => {
      // console.log(paragraphFields, errorConts);

      // this.isEditing = true;
      // this.submitBtn!.value = TEXT_CONTENT.profileSaveBtn;
      // deleteBtn.remove();

      // const paragraphField = instance.element;
      // const fieldName = paragraphField.dataset.name as string;
      // const formType = this.form.element.dataset.type;
      let inputField: InputField | BaseElement | null = null;

      if (inputName !== 'country') {
        inputField = new InputField([], {
          label: { content: TEXT_CONTENT.managerFormLabels[nameIndex] },
          input: {
            name: `${formType}${inputName[0].toUpperCase()}${inputName.slice(1)}`,
            type: 'text',
            placeholder: TEXT_CONTENT.inputAddressPHs[nameIndex],
          },
          error: { classes: [CLASS_NAMES.formError] },
        });

        if (inputName === 'postalCode') {
          const selectField = this.managerContDetailed.element[
            `${formType}Country` as keyof typeof this.managerContDetailed.element
          ] as HTMLInputElement;
          const postalField = (inputField as InputField).input.element;
          const countryIndex = selectField.dataset.index as string;

          postalField.setAttribute('placeholder', ADDRESSES_PROPS[+countryIndex].postalPH);
          postalField.setAttribute('data-country', countryIndex);
          postalField.setAttribute('data-pattern', ADDRESSES_PROPS[+countryIndex].postalPattern);

          postalPatternUpdating(selectField, postalField, false);
        }

        allInputsArray.push(inputField as InputField);
      } else {
        const selectOptions: BaseElement[] = [];

        ADDRESSES_PROPS.forEach((currentCountry) => {
          const currentOption = new BaseElement<HTMLOptionElement>({
            tag: 'option',
            content: currentCountry.countryName,
            value: currentCountry.countryCode,
          });
          selectOptions.push(currentOption);
        });

        const selectField = new BaseElement<HTMLSelectElement>(
          { tag: 'select', name: `${formType}${inputName[0].toUpperCase()}${inputName.slice(1)}` },
          ...selectOptions
        );
        selectField.setAttribute('data-index', '0');

        inputField = new BaseElement(
          {},
          new Label({ content: TEXT_CONTENT.managerFormLabels[nameIndex] }),
          selectField,
          new BaseElement({ classes: ['form-error'] })
        );
      }

      this.managerContDetailed.append(inputField);
    });

    const submitBtn = new Input({ value: TEXT_CONTENT.profileSaveBtn, type: 'submit' });
    this.managerContDetailed.appendChildren(
      new InputField([CLASS_NAMES.addrManager.defaultCheckBoxCont], {
        label: { content: TEXT_CONTENT.managerDefaultCheckBox },
        input: {
          name: CLASS_NAMES.addrManager.defaultCheckBoxName,
          type: 'checkbox',
        },
      }),
      new BaseElement({ classes: [CLASS_NAMES.addrManager.managerBtnsCont] }, submitBtn)
    );

    this.managerEngine.addressAdding(submitBtn, allInputsArray);
  }

  clickableElementsClassnamesClear(array: BaseElement<HTMLElement>[]) {
    array.forEach((field) => {
      field.element.classList.remove(CLASS_NAMES.addrManager.selectedAddress);
    });
  }
}
