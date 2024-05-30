import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
// import ProfileEngine from './profile_page_engine';
import Section from '@/utils/elements/section';
import BaseElement from '@/utils/elements/basic_element';
// import './profile_page.sass';
import Paragraph from '@/utils/elements/paragraph';
// import { AddresessProps } from '@/utils/types_variables/types';
import Form from '@/utils/elements/form';
// import Label from '@/utils/elements/label';
// import Input from '@/utils/elements/input';
// import Anchor from '@/utils/elements/anchor';
import ErrorContainer from '@/utils/elements/error_container';
import Button from '@/utils/elements/button';
import Label from '@/utils/elements/label';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import AddrManagerEngine from './profile_addr_manager_engine';

export default class AddrManagerPage extends Section {
  managerContDetailed = new Form({ classes: [CLASS_NAMES.profile.profileContDetailed] }); //debug
  managerEngine: AddrManagerEngine = new AddrManagerEngine(this.managerContDetailed);

  paragraphFields: Paragraph[] = [];
  errorConts: ErrorContainer[] = [];

  constructor() {
    super({ classes: [CLASS_NAMES.profile.profilePage] }); //debug

    void this.sumLayoutRendering();
  }

  async sumLayoutRendering() {
    const customerData = await sdk.getCustomerData();
    if (!customerData) return;

    const defaultAddresses = [customerData.defaultShippingAddressId, customerData.defaultBillingAddressId];
    const clickableElements = [];

    // title and main containers creating
    this.element.append(new BaseElement({ tag: 'h2', content: TEXT_CONTENT.addrManagerTitle }).element);
    const managerContMain = new BaseElement({ classes: [CLASS_NAMES.profile.profileContMain] }); //debug

    // sum container and elements creating

    const managerContSum = new BaseElement({ classes: [CLASS_NAMES.profile.profileContSum] }); //debug

    console.log(customerData); //debug
    const shipAddresses = customerData.shippingAddressIds;
    const billAddresses = customerData.billingAddressIds;

    const shipAddrCont = new BaseElement(
      { classes: ['shipCont'] }, //debug
      new Label({ content: TEXT_CONTENT.profileFields.addresses[0] })
    );
    const billAddrCont = new BaseElement(
      { classes: ['billCont'] }, //debug
      new Label({ content: TEXT_CONTENT.profileFields.addresses[1] })
    );

    const addressFieldCreator = (addrCont: BaseElement, fieldContent: string, id: string) => {
      const currentAddress = new Paragraph(`${fieldContent}`);
      currentAddress.setAttribute('id', id);

      if (defaultAddresses.includes(id)) {
        currentAddress.element.classList.add(CLASS_NAMES.profile.defaultAddress);
      }
      addrCont.appendChildren(currentAddress);
      clickableElements.push(currentAddress);
    };

    customerData.addresses.forEach((address) => {
      let countryName = 'Germany';
      if (address.country === 'FR') countryName = 'France';

      const fieldContent = `${address.postalCode}, ${countryName}, ${address.city}, ${address.streetName}`;

      if (shipAddresses!.includes(address.id!)) addressFieldCreator(shipAddrCont, fieldContent, address.id!);
      if (billAddresses!.includes(address.id!)) addressFieldCreator(billAddrCont, fieldContent, address.id!);
    });

    const addBtn = new Button({ content: 'Add New Address' }); //debug
    clickableElements.push(addBtn);

    managerContSum.appendChildren(shipAddrCont, billAddrCont, addBtn);

    //
    // const profileContSum = new BaseElement({ classes: [CLASS_NAMES.profile.profileContSum] });
    // const passwordBtn = new Button({
    //   content: TEXT_CONTENT.profileChangePassword,
    //   classes: [CLASS_NAMES.link, CLASS_NAMES.profile.profileEditPasswordBtn],
    // });

    // managerContSum.appendChildren(
    //   new BaseElement(
    //     { classes: [CLASS_NAMES.profile.profileSumWrapper] },
    //     new BaseElement({ classes: [CLASS_NAMES.profile.profileSumAvatar] }),
    //     new BaseElement(
    //       { classes: [CLASS_NAMES.profile.profileSumInfo] },
    //       new Paragraph(`${customerData.firstName} ${customerData.lastName}`),
    //       new Paragraph(`${customerData.email}`)
    //     ),
    //     passwordBtn
    //   )
    // );

    // this.profileEngine.passwordBtnController(passwordBtn, managerContSum);

    // stuff for detailed container
    this.managerContDetailed.element.setAttribute('novalidate', '');

    //   const fieldsIntoArrayPushing = (fieldContent: string, fieldType: string, fieldPH: string, prop: string) => {
    //     const currentField = new Paragraph(fieldContent);
    //     currentField.element.classList.add(CLASS_NAMES.profile.profileContentField);

    //     currentField.element.setAttribute('data-type', fieldType);
    //     currentField.element.setAttribute('data-PH', fieldPH);
    //     currentField.element.setAttribute('data-name', prop);

    //     this.paragraphFields.push(currentField);
    //     return currentField;
    //   };

    // detailed container and elements creating

    const managerPH = new BaseElement({
      tag: 'h3',
      content: 'Choose existing address to update it or add the new one', //debug
      classes: ['testH3'], //debug
    });
    managerPH.element.classList.add('jopa'); //debug

    this.managerContDetailed.appendChildren(managerPH);

    //   const editBtn = new Input({ value: TEXT_CONTENT.profileEditBtn, type: 'submit' });
    //   TEXT_CONTENT.profileProps.forEach((prop) => {
    //     const infoCont = new BaseElement({});

    //     let fieldContent = customerData[prop as keyof typeof customerData] as string | AddresessProps[];
    //     let fieldName = TEXT_CONTENT.profileFields[prop as keyof typeof TEXT_CONTENT.profileFields] as string;
    //     let fieldType = 'text';
    //     let fieldPH = fieldName;
    //     let isMainInfoEnds = false;

    //     if (prop === 'dateOfBirth' && typeof fieldContent === 'string') {
    //       fieldPH = fieldContent;
    //       fieldContent = fieldContent.split('-').reverse().join('.');
    //       fieldType = 'date';

    //       isMainInfoEnds = true;
    //     }

    //     if (prop === 'addresses' && typeof fieldContent !== 'string') {
    //       fieldContent.forEach((address, propIndex) => {
    //         const infoContAddress = new BaseElement({
    //           classes: [CLASS_NAMES.profile.profileDetailedAdressesCont[propIndex]],
    //         });

    //         let countryName = 'Germany';
    //         if (address.country === 'FR') countryName = 'France';

    //         fieldContent = `${address.postalCode}, ${countryName}, ${address.city}, ${address.streetName}`;
    //         fieldName = TEXT_CONTENT.profileFields.addresses[propIndex];

    //         infoContAddress.appendChildren(
    //           new Label({ content: fieldName }),
    //           fieldsIntoArrayPushing(fieldContent, fieldType, fieldPH, prop)
    //         );

    //         if (address.id === defaultAddresses[propIndex]) {
    //           infoContAddress.getChildren()[0].classList.add(CLASS_NAMES.profile.defaultAddress);
    //         }

    //         this.profileContDetailed.appendChildren(infoContAddress);
    //       });
    //     } else {
    //       const errorContainer = new ErrorContainer([CLASS_NAMES.formError]);
    //       this.errorConts.push(errorContainer);

    //       infoCont.appendChildren(
    //         new Label({ content: fieldName, htmlFor: prop }),
    //         fieldsIntoArrayPushing(fieldContent as string, fieldType, fieldPH, prop),
    //         errorContainer
    //       );
    //       this.profileContDetailed.appendChildren(infoCont);

    //       // submit button creation
    //       if (isMainInfoEnds) this.profileContDetailed.appendChildren(editBtn);
    //     }
    //   });

    // editing button creation and elements appending
    //   const managerBtn = new Anchor({
    //     href: 'addresses-manager',
    //     content: TEXT_CONTENT.profileManagerBtn,
    //     classes: [CLASS_NAMES.link, CLASS_NAMES.profile.profileManagerBtn],
    //   });

    //   this.profileContDetailed.appendChildren(managerBtn);

    managerContMain.appendChildren(managerContSum, this.managerContDetailed);
    this.element.append(managerContMain.element);

    // this.managerEngine.buttonController(clickableElements, customerData);
    //   this.profileEngine.buttonController(editBtn.element, this.paragraphFields, this.errorConts, customerData);

    clickableElements.forEach((element) => {
      element.addListener('click', (event) => {
        const currentElement = event.target as HTMLElement;

        this.managerContDetailed.removeChildren();
        this.detailedLayoutRendering(currentElement.id);
      });
    });
  }

  detailedLayoutRendering(id: string) {
    console.log(id);
  }
}
