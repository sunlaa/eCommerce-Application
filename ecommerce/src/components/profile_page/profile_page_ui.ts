import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import ProfileEngine from './profile_page_engine';
import Section from '@/utils/elements/section';
import BaseElement from '@/utils/elements/basic_element';
import './profile_page.sass';
import Paragraph from '@/utils/elements/paragraph';
import { AddresessProps } from '@/utils/types_variables/types';
import Button from '@/utils/elements/button';

export default class ProfilePage extends Section {
  customerData: ProfileEngine = new ProfileEngine();

  constructor() {
    super({ classes: [CLASS_NAMES.profile.profilePage] });

    void this.layoutRendering();
  }

  async layoutRendering() {
    const customerData = await this.customerData.getCustomerData();
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

    const profileContDetailed = new BaseElement({ classes: [CLASS_NAMES.profile.profileContDetailed] });

    TEXT_CONTENT.profileProps.forEach((prop) => {
      const infoCont = new BaseElement({});

      let fieldContent = customerData[prop as keyof typeof customerData] as string | AddresessProps[];
      let fieldName = TEXT_CONTENT.profileFields[prop as keyof typeof TEXT_CONTENT.profileFields] as string;

      if (prop === 'dateOfBirth' && typeof fieldContent === 'string') {
        fieldContent = fieldContent.split('-').reverse().join('.');
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

          infoContAddress.appendChildren(new Paragraph(fieldName), new Paragraph(fieldContent));

          if (address.id === defaultAddresses[propIndex]) {
            infoContAddress.getChildren()[0].classList.add(CLASS_NAMES.profile.defaultAddress);
          }

          profileContDetailed.appendChildren(infoContAddress);
        });
      } else {
        infoCont.appendChildren(new Paragraph(fieldName), new Paragraph(fieldContent as string));
        profileContDetailed.appendChildren(infoCont);
      }
    });

    const editBtn = new Button({ content: TEXT_CONTENT.profileEditBtn });
    profileContDetailed.appendChildren(editBtn);

    profileContMain.appendChildren(profileContSum, profileContDetailed);
    this.element.append(profileContMain.element);

    console.log(customerData);
  }
}
