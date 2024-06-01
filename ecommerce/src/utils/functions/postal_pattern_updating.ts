import FormValidation from '@/components/authentication/validation_engine';
import { ADDRESSES_PROPS } from '../types_variables/variables';

export default function postalPatternUpdating(
  selectField: HTMLInputElement,
  postalField: HTMLInputElement,
  isInputField: boolean
) {
  const validInstance: FormValidation = new FormValidation();

  selectField.addEventListener('change', () => {
    ADDRESSES_PROPS.forEach((currentCountry, countryIndex) => {
      if (currentCountry.countryCode === selectField.value) {
        selectField.setAttribute('data-index', `${countryIndex}`);
        postalField.setAttribute('data-country', `${countryIndex}`);
        postalField.setAttribute('data-pattern', currentCountry.postalPattern);
      }
    });

    validInstance.postalReValidation(postalField, isInputField);
  });
}
