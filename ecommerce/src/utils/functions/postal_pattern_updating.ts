import { ADDRESSES_PROPS } from '../types_variables/variables';

export default function postalPatternUpdating(selectField: HTMLInputElement, postalField: HTMLInputElement) {
  selectField.addEventListener('change', () => {
    ADDRESSES_PROPS.forEach((currentCountry, countryIndex) => {
      if (currentCountry.countryCode === selectField.value) {
        selectField.setAttribute('data-index', `${countryIndex}`);
        postalField.setAttribute('data-country', `${countryIndex}`);
        postalField.setAttribute('data-pattern', currentCountry.postalPattern);
      }
    });
  });
}
