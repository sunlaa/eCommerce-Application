import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import InputField from '@/utils/elements/input_field';
import Paragraph from '@/utils/elements/paragraph';
import { ADDRESSES_PROPS, CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class RegFormUi extends Form {
  regForm: RegFormUi;
  checkbox: Input | null = null;
  submitBtn: Input | null = null;
  sectionRegForm: HTMLElement;

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
        const referenceType = CLASS_NAMES.regFormInputNames[elementIndex].split('__')[1].split('-')[0];
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
            name: CLASS_NAMES.regFormCheckboxName,
            type: 'checkbox',
            checked: true,
          },
        });

        this.append(currentElement);
        this.checkbox = currentElement.input;
      } else {
        const currentElement = new InputField([contClassName], {
          input: {
            type: 'submit',
            value: TEXT_CONTENT.inputRegBtn,
          },
          error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.regFormErrorGeneral] },
        });

        this.append(currentElement);
        this.submitBtn = currentElement.input;
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
            });

            selectOptions.push(currentOption);
          });

          const currentElement = new BaseElement(
            { classes: [contClassName] },
            new BaseElement({ tag: 'label', content: TEXT_CONTENT.inputAddressNames[elementIndex] }),
            new BaseElement<HTMLSelectElement>({ tag: 'select', disabled: isDisabled }, ...selectOptions),
            new BaseElement({
              tag: 'p',
              classes: [CLASS_NAMES.formError, addressInputsClassname.regAddressErrorCont[elementIndex]],
            })
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
          if (elementIndex === 3) currentInput.setAttribute('data-index', '0');

          currentCont.append(currentElement.element);
          this.inputFields.push(currentElement);
        }
      });
    });
  }

  getCheckBox() {
    return this.checkbox;
  }

  getSubmitBtn() {
    return this.submitBtn;
  }
}
