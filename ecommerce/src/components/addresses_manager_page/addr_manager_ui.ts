import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
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
import Anchor from '@/utils/elements/anchor';
import InputField from '@/utils/elements/input_field';
import AddrManagerEngine from './addr_manager_engine';

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
    const clickableElements = [];

    // title and main containers creating
    this.element.append(new BaseElement({ tag: 'h2', content: TEXT_CONTENT.addrManagerTitle }).element);
    const managerContMain = new BaseElement({ classes: [CLASS_NAMES.addrManager.managerContMain] });

    // sum container and elements creating

    const managerContSum = new BaseElement({ classes: [CLASS_NAMES.addrManager.managerContSum] });
    const shipAddresses = this.customerData.shippingAddressIds;
    const billAddresses = this.customerData.billingAddressIds;

    const shipAddrCont = new BaseElement(
      { tag: 'ul' },
      new BaseElement({ tag: 'li', content: TEXT_CONTENT.profileFields.addresses[0] })
    );
    const billAddrCont = new BaseElement(
      { tag: 'ul' },
      new BaseElement({ tag: 'li', content: TEXT_CONTENT.profileFields.addresses[1] })
    );

    const addressFieldCreator = (addrCont: BaseElement, fieldContent: string, id: string, type: string) => {
      const currentAddress = new BaseElement({ tag: 'li', content: `${fieldContent}` });
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

    const addBtn = new Button({ content: TEXT_CONTENT.managerAddBtn });
    clickableElements.push(addBtn);

    managerContSum.appendChildren(shipAddrCont, billAddrCont, addBtn);

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
        let currentElement = event.target as HTMLElement;
        if (currentElement.tagName === 'SPAN') currentElement = (event.target as HTMLElement).parentElement!;

        this.managerContDetailed.removeChildren();
        if (currentElement.id) {
          this.detailedLayoutRendering(currentElement.id, currentElement.dataset.isDefault!);
          this.managerContDetailed.setAttribute('data-type', currentElement.dataset.type!);
        } else {
          this.managerContDetailed.removeAttribute('data-type');
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

    const fieldsIntoArrayPushing = (fieldContent: string, fieldPH: string, prop: string) => {
      const currentField = new Paragraph(fieldContent);
      currentField.element.classList.add(CLASS_NAMES.addrManager.managerContentField);

      currentField.element.setAttribute('data-PH', fieldPH);
      currentField.element.setAttribute('data-name', prop);

      this.paragraphFields.push(currentField);
      return currentField;
    };

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
      this.errorConts.push(errorContainer);

      infoCont.appendChildren(
        new Label({ content: TEXT_CONTENT.managerFormLabels[propIndex], htmlFor: prop }),
        fieldsIntoArrayPushing(fieldContent, fieldPH, prop),
        errorContainer
      );

      this.managerContDetailed.append(infoCont);
    });

    const defaultCheckbox = new InputField([CLASS_NAMES.addrManager.defaultCheckBoxCont], {
      label: { content: TEXT_CONTENT.managerDefaultCheckBox },
      input: {
        name: CLASS_NAMES.addrManager.defaultCheckBoxName,
        type: 'checkbox',
        checked: Boolean(isDefault),
        disabled: true,
      },
    });

    const btnsCont = new BaseElement(
      { classes: [CLASS_NAMES.addrManager.managerBtnsCont] },
      new Input({ value: TEXT_CONTENT.managerEditBtn, type: 'submit' }),
      new Anchor({
        href: 'addresses-manager',
        content: TEXT_CONTENT.managerDeleteBtn,
        classes: [CLASS_NAMES.link, CLASS_NAMES.profile.profileManagerBtn],
      })
    );

    this.managerContDetailed.appendChildren(defaultCheckbox, btnsCont);
  }

  newAddressLayoutRendering() {
    console.log('jopa');
  }
}
