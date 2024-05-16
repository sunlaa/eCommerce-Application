/**
 * @jest-environment jsdom
 */

import { ADDRESSES_PROPS, CLASS_NAMES, ERROR_MSG } from '../../utils/types_variables/variables';
import InputField from '../../utils/elements/input_field';
import FormValidation from './validation_engine';

describe('validation', () => {
  const testData: {
    inputType: string;
    inputValue: string;
    inputName: string;
    errorMsg: string;
    testErrorMsg: string;
    inputPattern?: string;
    inputCountry?: string;
  }[] = [
    {
      inputType: 'text',
      inputValue: '',
      inputName: '',
      errorMsg: ERROR_MSG.general[0],
      testErrorMsg: 'Text fields require checking',
    },
    {
      inputType: 'password',
      inputValue: '',
      inputName: '',
      errorMsg: ERROR_MSG.general[0],
      testErrorMsg: 'Password field require checking',
    },
    {
      inputType: 'text',
      inputValue: 'D-1234',
      inputName: CLASS_NAMES.regAddressClasses[0].regAddressNames[3],
      errorMsg: ERROR_MSG.postal[0],
      testErrorMsg: 'France postal code pattern checking',
      inputPattern: ADDRESSES_PROPS[0].postalPattern,
      inputCountry: '0',
    },
    {
      inputType: 'text',
      inputValue: 'F-1234',
      inputName: CLASS_NAMES.regAddressClasses[1].regAddressNames[3],
      errorMsg: ERROR_MSG.postal[1],
      testErrorMsg: 'Germany postal code pattern checking',
      inputPattern: ADDRESSES_PROPS[1].postalPattern,
      inputCountry: '1',
    },
    {
      inputType: 'password',
      inputValue: '123',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[0],
      testErrorMsg: 'Password length checking checking for password type field',
    },
    {
      inputType: 'password',
      inputValue: '12345678',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[1],
      testErrorMsg: 'Password capital letters checking for password type field',
    },
    {
      inputType: 'password',
      inputValue: '12345678A',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[2],
      testErrorMsg: 'Password lowercase letters checking for password type field',
    },
    {
      inputType: 'password',
      inputValue: 'QwErTyUi',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[3],
      testErrorMsg: 'Password numbers checking for password type field',
    },
    {
      inputType: 'password',
      inputValue: 'QwEr TyUi',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[4],
      testErrorMsg: 'Password whitespaces checking for password type field',
    },
    {
      inputType: 'text',
      inputValue: '123',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[0],
      testErrorMsg: 'Password length checking checking for text type field',
    },
    {
      inputType: 'text',
      inputValue: '12345678',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[1],
      testErrorMsg: 'Password capital letters checking for text type field',
    },
    {
      inputType: 'text',
      inputValue: '12345678A',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[2],
      testErrorMsg: 'Password lowercase letters checking for text type field',
    },
    {
      inputType: 'text',
      inputValue: 'QwErTyUi',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[3],
      testErrorMsg: 'Password numbers checking for text type field',
    },
    {
      inputType: 'text',
      inputValue: 'QwEr TyUi',
      inputName: CLASS_NAMES.regFormInputNames[1],
      errorMsg: ERROR_MSG.password[4],
      testErrorMsg: 'Password whitespaces checking for text type field',
    },
    {
      inputType: 'text',
      inputValue: 'awd',
      inputName: CLASS_NAMES.regFormInputNames[0],
      errorMsg: ERROR_MSG.email[0],
      testErrorMsg: 'Email @ checking',
    },
    {
      inputType: 'text',
      inputValue: '@test',
      inputName: CLASS_NAMES.regFormInputNames[0],
      errorMsg: ERROR_MSG.email[1],
      testErrorMsg: 'Email name length checking',
    },
    {
      inputType: 'text',
      inputValue: 'awd@',
      inputName: CLASS_NAMES.regFormInputNames[0],
      errorMsg: ERROR_MSG.email[2],
      testErrorMsg: 'Email domain name checking',
    },
    {
      inputType: 'text',
      inputValue: 'awd@mail',
      inputName: CLASS_NAMES.regFormInputNames[0],
      errorMsg: ERROR_MSG.email[3],
      testErrorMsg: 'Email correct domain name checking',
    },
    {
      inputType: 'text',
      inputValue: 'aw&d@mail.ru',
      inputName: CLASS_NAMES.regFormInputNames[0],
      errorMsg: ERROR_MSG.email[4],
      testErrorMsg: 'Email special symbols checking',
    },
    {
      inputType: 'text',
      inputValue: 'абобус@mail.ru',
      inputName: CLASS_NAMES.regFormInputNames[0],
      errorMsg: ERROR_MSG.email[5],
      testErrorMsg: 'Email only english letters checking',
    },
    {
      inputType: 'text',
      inputValue: 'te st@mail.ru',
      inputName: CLASS_NAMES.regFormInputNames[0],
      errorMsg: ERROR_MSG.email[6],
      testErrorMsg: 'Email whitespaces checking',
    },
    {
      inputType: 'text',
      inputValue: '24te-st&',
      inputName: CLASS_NAMES.regFormInputNames[2],
      errorMsg: ERROR_MSG.general[1],
      testErrorMsg: 'Name special characters and number checking',
    },
    {
      inputType: 'text',
      inputValue: '24te-st&',
      inputName: CLASS_NAMES.regFormInputNames[3],
      errorMsg: ERROR_MSG.general[1],
      testErrorMsg: 'Surname special characters and number checking',
    },
    {
      inputType: 'text',
      inputValue: '24te-st&',
      inputName: CLASS_NAMES.regAddressClasses[0].regAddressNames[1],
      errorMsg: ERROR_MSG.general[1],
      testErrorMsg: 'Shipping city special characters and number checking',
    },
    {
      inputType: 'text',
      inputValue: '24te-st&',
      inputName: CLASS_NAMES.regAddressClasses[1].regAddressNames[1],
      errorMsg: ERROR_MSG.general[1],
      testErrorMsg: 'Billing city special characters and number checking',
    },
  ];

  test.each(testData)(
    'Should return following message: "$errorMsg" for $testErrorMsg',
    ({ inputType, inputValue, inputName, errorMsg, inputPattern, inputCountry }) => {
      const testInput = new InputField([], {
        input: {
          type: inputType,
          value: inputValue,
          name: inputName,
        },
        error: { classes: [] },
      });

      if (inputPattern && inputCountry) {
        testInput.input.setAttribute('data-pattern', inputPattern);
        testInput.input.setAttribute('data-country', inputCountry);
        testInput.input.setAttribute('data-index', inputCountry);
      }

      const validationInstance = new FormValidation();
      const validity = validationInstance.validate(testInput);

      expect(validity).toEqual(errorMsg);
    }
  );
});
