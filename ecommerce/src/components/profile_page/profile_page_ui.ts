import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import ProfileEngine from './profile_page_engine';
import Section from '@/utils/elements/section';
import BaseElement from '@/utils/elements/basic_element';
import './profile_page.sass';
import Paragraph from '@/utils/elements/paragraph';
import { AddresessProps } from '@/utils/types_variables/types';
import Form from '@/utils/elements/form';
import Label from '@/utils/elements/label';
import Input from '@/utils/elements/input';

export default class ProfilePage extends Section {
  profileContDetailed = new Form({ classes: [CLASS_NAMES.profile.profileContDetailed] });
  profileEngine: ProfileEngine = new ProfileEngine(this.profileContDetailed);
  mainContaner: BaseElement;

  paragraphFields: Paragraph[] = [];

  constructor(main: BaseElement) {
    super({ classes: [CLASS_NAMES.profile.profilePage] });

    this.mainContaner = main;
    void this.layoutRendering();
  }

  async layoutRendering() {
    const customerData = await this.profileEngine.getCustomerData();
    if (!customerData) return;

    const defaultAddresses = [customerData.defaultShippingAddressId, customerData.defaultBillingAddressId];

    this.element.append(new BaseElement({ tag: 'h2', content: TEXT_CONTENT.profileTitle }).element);
    const profileContMain = new BaseElement({ classes: [CLASS_NAMES.profile.profileContMain] });

    const profileContSum = new BaseElement({ classes: [CLASS_NAMES.profile.profileContSum] });
    profileContSum.appendChildren(
      new BaseElement(
        { classes: [CLASS_NAMES.profile.profileSumWrapper] },
        new BaseElement({ classes: [CLASS_NAMES.profile.profileSumAvatar] }),
        new BaseElement(
          { classes: [CLASS_NAMES.profile.profileSumInfo] },
          new Paragraph(`${customerData.firstName} ${customerData.lastName}`),
          new Paragraph(`${customerData.email}`)
        )
      )
    );

    this.profileContDetailed.element.setAttribute('novalidate', '');

    const fieldsIntoArrayPushing = (fieldContent: string, fieldType: string) => {
      const currentField = new Paragraph(fieldContent);
      currentField.element.setAttribute('data-type', fieldType);
      this.paragraphFields.push(currentField);

      return currentField;
    };

    TEXT_CONTENT.profileProps.forEach((prop) => {
      const infoCont = new BaseElement({});

      let fieldContent = customerData[prop as keyof typeof customerData] as string | AddresessProps[];
      let fieldName = TEXT_CONTENT.profileFields[prop as keyof typeof TEXT_CONTENT.profileFields] as string;
      let fieldType = 'text';

      if (prop === 'dateOfBirth' && typeof fieldContent === 'string') {
        fieldContent = fieldContent.split('-').reverse().join('.');
        fieldType = 'date';
      }
      if (prop === 'password' && typeof fieldContent === 'string') {
        fieldContent = '●'.repeat(prop.length);
        fieldType = 'password';
      }

      if (prop === 'addresses' && typeof fieldContent !== 'string') {
        fieldContent.forEach((address, propIndex) => {
          const infoContAddress = new BaseElement({
            classes: [CLASS_NAMES.profile.profileDetailedAdressesCont[propIndex]],
          });

          let countryName = 'Germany';
          if (address.country === 'FR') countryName = 'France';

          fieldContent = `${address.postalCode}, ${countryName}, ${address.city}, ${address.streetName}`;
          fieldName = TEXT_CONTENT.profileFields.addresses[propIndex];

          infoContAddress.appendChildren(
            new Label({ content: fieldName }),
            fieldsIntoArrayPushing(fieldContent, fieldType),
            new BaseElement({ tag: 'p', classes: [CLASS_NAMES.formError] })
          );

          if (address.id === defaultAddresses[propIndex]) {
            infoContAddress.getChildren()[0].classList.add(CLASS_NAMES.profile.defaultAddress);
          }

          this.profileContDetailed.appendChildren(infoContAddress);
        });
      } else {
        infoCont.appendChildren(
          new Label({ content: fieldName, htmlFor: prop }),
          fieldsIntoArrayPushing(fieldContent as string, fieldType),
          new BaseElement({ tag: 'p', classes: [CLASS_NAMES.formError] })
        );
        this.profileContDetailed.appendChildren(infoCont);
      }
    });

    const editBtn = new Input({ value: TEXT_CONTENT.profileEditBtn, type: 'submit' });
    this.profileContDetailed.appendChildren(editBtn);

    profileContMain.appendChildren(profileContSum, this.profileContDetailed);
    this.element.append(profileContMain.element);

    this.profileEngine.buttonController(editBtn.element, this.paragraphFields, this.mainContaner, customerData);
  }
}
