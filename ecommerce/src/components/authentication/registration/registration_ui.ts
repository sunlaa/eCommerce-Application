import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import InputField from '@/utils/elements/input_field';
import { ADDRESSES_PROPS, CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

//TODO: fix id's
export default class RegFormUi extends Form {
  checkbox: HTMLElement | null;
  submitBtn: HTMLElement | null;

  constructor() {
    super({
      classes: [CLASS_NAMES.regForm],
    });

    this.checkbox = null;
    this.submitBtn = null;
    this.spawnInputs();
  }

  spawnInputs() {
    let inputType;
    CLASS_NAMES.regFormCont.forEach((contClassName, elementIndex) => {
      if (elementIndex < 5) {
        const referenceType = CLASS_NAMES.regFormInputNames[elementIndex].split('__')[1].split('-')[0];
        inputType = 'text';

        if (referenceType === 'email' || referenceType === 'date' || referenceType === 'password') {
          inputType = referenceType;
        }

        const currentElement = new InputField([contClassName], {
          label: { content: TEXT_CONTENT.inputNames[elementIndex] },
          input: {
            name: CLASS_NAMES.regFormInputNames[elementIndex],
            id: CLASS_NAMES.regFormInputNames[elementIndex],
            type: inputType,
            placeholder: TEXT_CONTENT.inputPHs[elementIndex],
          },
          error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.regFormErrorCont[elementIndex]] },
        });

        if (elementIndex === 4) {
          const currentInput = currentElement.element.querySelector('input') as HTMLInputElement;
          currentInput.setAttribute('value', TEXT_CONTENT.inputPHs[4]);
        }

        this.element.append(currentElement.element);
      } else if (elementIndex === 5) {
        const currentElement = new BaseElement(
          { classes: [CLASS_NAMES.regFormCont[elementIndex]], styles: { display: 'flex' } }, // delete display: flex
          new BaseElement(
            { classes: [CLASS_NAMES.regFormAdressShip] },
            new BaseElement({ tag: 'p', content: TEXT_CONTENT.inputAddressShip })
          ),
          new BaseElement(
            { classes: [CLASS_NAMES.regFormAdressBill] },
            new BaseElement({ tag: 'p', content: TEXT_CONTENT.inputAddressBill })
          )
        );

        this.element.append(currentElement.element);
      } else if (elementIndex === 6) {
        const currentElement = new InputField([contClassName], {
          label: { content: TEXT_CONTENT.inputCheckbox },
          input: {
            name: CLASS_NAMES.regFormCheckboxName,
            id: CLASS_NAMES.regFormCheckboxName,
            type: 'checkbox',
            checked: true,
          },
        });

        this.element.append(currentElement.element);
        this.checkbox = currentElement.element;
      } else {
        const currentElement = new InputField([contClassName], {
          label: {}, // поправить компонент, чтобы лейбл был необязательный
          input: {
            name: '',
            id: '', //поправить компонент, чтобы можно было не вводить имя и айди
            type: 'submit',
            value: TEXT_CONTENT.inputRegBtn,
          },
          error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.regFormErrorGeneral] },
        });

        this.element.append(currentElement.element);
        this.submitBtn = currentElement.element;
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
          const selectOptions = [] as BaseElement[];

          ADDRESSES_PROPS.forEach((currentCountry) => {
            const currentOption = new BaseElement<HTMLOptionElement>({
              tag: 'option',
              content: currentCountry.countryName,
            });
            currentOption.element.setAttribute('data-pattern', currentCountry.postalPattern);
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

          currentCont.append(currentElement.element);
        } else {
          const currentElement = new InputField([contClassName], {
            label: { content: TEXT_CONTENT.inputAddressNames[elementIndex] },
            input: {
              name: addressInputsClassname.regAddressNames[elementIndex],
              id: addressInputsClassname.regAddressNames[elementIndex],
              type: 'text',
              placeholder: TEXT_CONTENT.inputAddressPHs[elementIndex],
              disabled: isDisabled,
            },
            error: { classes: [CLASS_NAMES.formError, addressInputsClassname.regAddressErrorCont[elementIndex]] },
          });

          currentCont.append(currentElement.element);
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
