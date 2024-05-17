import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import InputField from '@/utils/elements/input_field';
import Paragraph from '@/utils/elements/paragraph';
import { ADDRESSES_PROPS, CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class RegFormUi extends Form {
  regForm: RegFormUi;
  checkbox: Input | null = null;
  sectionRegForm: HTMLElement;

  shipSelect: BaseElement<HTMLSelectElement> | null = null;
  billSelect: BaseElement<HTMLSelectElement> | null = null;

  shipPostal: HTMLInputElement | null = null;
  billPostal: HTMLInputElement | null = null;

  shipInputs: InputField[] = [];
  billInputs: InputField[] = [];

  submit: InputField | null = null;

  constructor() {
    super({
      classes: [CLASS_NAMES.regForm],
    });

    this.spawnInputs();

    this.regForm = this;

    const regFormSection = new BaseElement({ tag: 'section', classes: [CLASS_NAMES.regPageContainer] });
    regFormSection.append(new BaseElement({ tag: 'h2', content: TEXT_CONTENT.titleRegPage }));

    this.regForm.element.setAttribute('novalidate', '');
    regFormSection.append(this.regForm.element);

    this.sectionRegForm = regFormSection.element;
  }

  spawnInputs() {
    let inputType;
    CLASS_NAMES.regFormCont.forEach((contClassName, elementIndex) => {
      if (elementIndex < 5) {
        const referenceType = CLASS_NAMES.regFormInputNames[elementIndex];
        inputType = 'text';

        if (referenceType === 'date' || referenceType === 'password') {
          inputType = referenceType;
        }

        const currentElement = new InputField([contClassName], {
          label: { content: TEXT_CONTENT.inputNames[elementIndex] },
          input: {
            name: CLASS_NAMES.regFormInputNames[elementIndex],
            type: inputType,
            placeholder: TEXT_CONTENT.inputPHs[elementIndex],
          },
          error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.regFormErrorCont[elementIndex]] },
        });

        if (elementIndex === 4) {
          const currentInput = currentElement.element.querySelector('input') as HTMLInputElement;
          currentInput.setAttribute('value', TEXT_CONTENT.inputPHs[4]);
        }

        this.append(currentElement);
        this.inputFields.push(currentElement);
      } else if (elementIndex === 5) {
        const currentElement = new BaseElement(
          { classes: [CLASS_NAMES.regFormCont[elementIndex]], styles: { display: 'flex' } }, // delete display: flex
          new BaseElement({ classes: [CLASS_NAMES.regFormAdressShip] }, new Paragraph(TEXT_CONTENT.inputAddressShip)),
          new BaseElement({ classes: [CLASS_NAMES.regFormAdressBill] }, new Paragraph(TEXT_CONTENT.inputAddressBill))
        );

        this.append(currentElement);
      } else if (elementIndex === 6) {
        const currentElement = new InputField([contClassName], {
          label: { content: TEXT_CONTENT.inputCheckbox },
          input: {
            name: CLASS_NAMES.regFormInputNames[5],
            type: 'checkbox',
            checked: true,
          },
        });

        const defaultCheckbox = new InputField([contClassName], {
          label: { content: TEXT_CONTENT.inputDefaultCheckbox },
          input: {
            name: CLASS_NAMES.regFormInputNames[6],
            type: 'checkbox',
            checked: true,
          },
        });

        this.appendChildren(defaultCheckbox, currentElement);
        this.checkbox = currentElement.input;
      } else {
        const currentElement = new InputField([contClassName], {
          input: {
            type: 'submit',
            value: TEXT_CONTENT.inputRegBtn,
          },
          error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.regFormErrorGeneral] },
        });

        this.submit = currentElement;
        this.append(currentElement);
      }
    });

    this.spawnAddressInputs();
  }

  spawnAddressInputs() {
    const mainAddressesCont = this.element.querySelector(`.${CLASS_NAMES.regFormAdressCont}`) as HTMLElement;
    new Array(...mainAddressesCont.children).forEach((currentCont, addressIndex) => {
      let isDisabled = false;
      if (addressIndex) isDisabled = true;

      const addressInputsClassname = CLASS_NAMES.regAddressClasses[addressIndex];
      addressInputsClassname.regAddressCont.forEach((contClassName, elementIndex) => {
        if (elementIndex === 2) {
          const selectOptions: BaseElement[] = [];

          ADDRESSES_PROPS.forEach((currentCountry) => {
            const currentOption = new BaseElement<HTMLOptionElement>({
              tag: 'option',
              content: currentCountry.countryName,
              value: currentCountry.countryCode,
            });

            selectOptions.push(currentOption);
          });

          const select = new BaseElement<HTMLSelectElement>(
            { tag: 'select', name: addressInputsClassname.regAddressNames[elementIndex], disabled: isDisabled },
            ...selectOptions
          );

          addressIndex === 0 ? (this.shipSelect = select) : (this.billSelect = select);

          const currentElement = new BaseElement(
            { classes: [contClassName] },
            new BaseElement({ tag: 'label', content: TEXT_CONTENT.inputAddressNames[elementIndex] }),
            select
          );

          const currentInput = currentElement.element.querySelector('select') as HTMLSelectElement;
          currentInput.setAttribute('data-index', `${addressIndex}`);

          currentCont.append(currentElement.element);
        } else {
          const currentElement = new InputField([contClassName], {
            label: { content: TEXT_CONTENT.inputAddressNames[elementIndex] },
            input: {
              name: addressInputsClassname.regAddressNames[elementIndex],
              type: 'text',
              placeholder: TEXT_CONTENT.inputAddressPHs[elementIndex],
              disabled: isDisabled,
            },
            error: { classes: [CLASS_NAMES.formError, addressInputsClassname.regAddressErrorCont[elementIndex]] },
          });

          const currentInput = currentElement.element.querySelector('input') as HTMLInputElement;

          if (elementIndex === 3) {
            addressIndex === 0 ? (this.shipPostal = currentInput) : (this.billPostal = currentInput);
          }

          currentCont.append(currentElement.element);

          addressIndex === 0 ? this.shipInputs.push(currentElement) : this.billInputs.push(currentElement);

          this.inputFields.push(currentElement);
        }
      });
    });
  }
}
