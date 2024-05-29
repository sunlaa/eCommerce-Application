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
import Anchor from '@/utils/elements/anchor';
import ErrorContainer from '@/utils/elements/error_container';

export default class ProfilePage extends Section {
  profileContDetailed = new Form({ classes: [CLASS_NAMES.profile.profileContDetailed] });
  profileEngine: ProfileEngine = new ProfileEngine(this.profileContDetailed);
  mainContaner: BaseElement;

  paragraphFields: Paragraph[] = [];
  errorConts: ErrorContainer[] = [];

  constructor(main: BaseElement) {
    super({ classes: [CLASS_NAMES.profile.profilePage] });

    this.mainContaner = main;
    void this.layoutRendering();
  }

  async layoutRendering() {
    const customerData = await this.profileEngine.getCustomerData();
    if (!customerData) return;

    const defaultAddresses = [customerData.defaultShippingAddressId, customerData.defaultBillingAddressId];

    // title and main containers creating
    this.element.append(new BaseElement({ tag: 'h2', content: TEXT_CONTENT.profileTitle }).element);
    const profileContMain = new BaseElement({ classes: [CLASS_NAMES.profile.profileContMain] });

    // sum container and elements creating
    const profileContSum = new BaseElement({ classes: [CLASS_NAMES.profile.profileContSum] });
    profileContSum.appendChildren(
      new BaseElement(
        { classes: [CLASS_NAMES.profile.profileSumWrapper] },
        new BaseElement({ classes: [CLASS_NAMES.profile.profileSumAvatar] }),
        new BaseElement(
          { classes: [CLASS_NAMES.profile.profileSumInfo] },
          new Paragraph(`${customerData.firstName} ${customerData.lastName}`),
          new Paragraph(`${customerData.email}`)
        ),
        new Anchor({
          href: 'password-manager',
          content: TEXT_CONTENT.profileChangePassword,
          classes: [CLASS_NAMES.link, CLASS_NAMES.profile.profileEditPasswordBtn],
        })
      )
    );

    // stuff for detailed container
    this.profileContDetailed.element.setAttribute('novalidate', '');

    const fieldsIntoArrayPushing = (fieldContent: string, fieldType: string, fieldPH: string, prop: string) => {
      const currentField = new Paragraph(fieldContent);
      currentField.element.classList.add(CLASS_NAMES.profile.profileContentField);

      currentField.element.setAttribute('data-type', fieldType);
      currentField.element.setAttribute('data-PH', fieldPH);
      currentField.element.setAttribute('data-name', prop);

      this.paragraphFields.push(currentField);
      return currentField;
    };

    // detailed container and elements creating

    const editBtn = new Input({ value: TEXT_CONTENT.profileEditBtn, type: 'submit' });
    TEXT_CONTENT.profileProps.forEach((prop) => {
      const infoCont = new BaseElement({});

      let fieldContent = customerData[prop as keyof typeof customerData] as string | AddresessProps[];
      let fieldName = TEXT_CONTENT.profileFields[prop as keyof typeof TEXT_CONTENT.profileFields] as string;
      let fieldType = 'text';
      let fieldPH = fieldName;
      let isMainInfoEnds = false;

      if (prop === 'dateOfBirth' && typeof fieldContent === 'string') {
        fieldPH = fieldContent;
        fieldContent = fieldContent.split('-').reverse().join('.');
        fieldType = 'date';

        isMainInfoEnds = true;
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
            fieldsIntoArrayPushing(fieldContent, fieldType, fieldPH, prop)
          );

          if (address.id === defaultAddresses[propIndex]) {
            infoContAddress.getChildren()[0].classList.add(CLASS_NAMES.profile.defaultAddress);
          }

          this.profileContDetailed.appendChildren(infoContAddress);
        });
      } else {
        const errorContainer = new ErrorContainer([CLASS_NAMES.formError]);
        this.errorConts.push(errorContainer);

        infoCont.appendChildren(
          new Label({ content: fieldName, htmlFor: prop }),
          fieldsIntoArrayPushing(fieldContent as string, fieldType, fieldPH, prop),
          errorContainer
        );
        this.profileContDetailed.appendChildren(infoCont);

        // submit button creation
        if (isMainInfoEnds) this.profileContDetailed.appendChildren(editBtn);
      }
    });

    // editing button creation and elements appending
    const managerBtn = new Anchor({
      href: 'addresses-manager',
      content: TEXT_CONTENT.profileManagerBtn,
      classes: [CLASS_NAMES.link, CLASS_NAMES.profile.profileManagerBtn],
    });

    this.profileContDetailed.appendChildren(managerBtn);

    profileContMain.appendChildren(profileContSum, this.profileContDetailed);
    this.element.append(profileContMain.element);

    this.profileEngine.buttonController(
      editBtn.element,
      this.paragraphFields,
      this.mainContaner,
      this.errorConts,
      customerData
    );
  }
}
