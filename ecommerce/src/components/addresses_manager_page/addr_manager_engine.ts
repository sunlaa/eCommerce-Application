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
    console.log(paragraphFields, errorConts);

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

          postalPatternUpdating(select, inputField.element as HTMLInputElement);
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

  editingModeOff() {
    let isValidError = false;
    this.allInputsArray.forEach((inputField) => {
      if (this.validInstance.validate(inputField, null)) isValidError = true;
    });
    if (isValidError) return;

    this.isEditing = false;

    //await
    //show mesage
    smoothTransitionTo(new AddrManagerPage());
  }

  addressAdding(submitBtn: Input, allInputsArray: InputField[]) {
    console.log(allInputsArray);

    this.form.addListener('submit', (event) => {
      event.preventDefault();
    });

    submitBtn.addListener('click', () => {
      console.log('submit');

      smoothTransitionTo(new AddrManagerPage());
    });
  }

  addressRemoving(button: Input) {
    button.addListener('click', () => {
      console.log(this.form.getData());
      smoothTransitionTo(new AddrManagerPage());
    });
  }
}
