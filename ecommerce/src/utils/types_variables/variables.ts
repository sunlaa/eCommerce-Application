export const TEXT_CONTENT = {
  inputNames: ['E-mail', 'Password', 'First name', 'Last name', 'Date of birth'],
  inputPHs: ['example@gmail.com', 'Qwerty12345', 'Mike', 'Shinoda', '2011-01-01'],

  inputAddressShip: 'Shipping Address',
  inputAddressBill: 'Billing Address',

  inputAddressNames: ['Street', 'City', 'Country', 'Postal code'],
  inputAddressPHs: ['Baker str.', 'London', 'France', '75012'],

  inputCheckbox: 'Shipping and billing addresses are the same',
  inputRegBtn: 'Register',
};

export const NUMERIC_DATA = { animationDuration: 200 };

export const CLASS_NAMES = {
  regForm: 'reg-form',
  regFormAdressCont: 'reg-form__adresses-cont',
  regFormAdressShip: 'reg-form__adress-ship-cont',
  regFormAdressBill: 'reg-form__adress-bill-cont',

  regFormCont: [
    'reg-form__email-cont',
    'reg-form__password-cont',
    'reg-form__name-cont',
    'reg-form__surname-cont',
    'reg-form__date-cont',
    'reg-form__adresses-cont',
    'reg-form__check-box-cont',
    'reg-form__reg-btn',
  ],
  regFormInputNames: [
    'reg-form__email-input',
    'reg-form__password-input',
    'reg-form__name-input',
    'reg-form__surname-input',
    'reg-form__date-input',
    'reg-form__check-box-input',
  ],
  regFormErrorCont: [
    'reg-form__email-error',
    'reg-form__password-error',
    'reg-form__name-error',
    'reg-form__surname-error',
    'reg-form__date-error',
  ],

  regFormCheckboxName: 'reg-form__check-box-name',

  regFormButtonName: 'reg-form__reg-btn',
  regFormErrorGeneral: 'ref-form__error-gen-cont',

  regAddressClasses: [
    {
      regAddressCont: [
        'reg-form__ship-street-cont',
        'reg-form__ship-city-cont',
        'reg-form__ship-country-cont',
        'reg-form__ship-postal-cont',
      ],
      regAddressNames: [
        'reg-form__ship-street-input',
        'reg-form__ship-city-input',
        'reg-form__ship-country-input',
        'reg-form__ship-postal-input',
      ],
      regAddressErrorCont: [
        'reg-form__ship-street-error',
        'reg-form__ship-city-error',
        'reg-form__ship-country-error',
        'reg-form__ship-postal-error',
      ],
    },
    {
      regAddressCont: [
        'reg-form__bill-street-cont',
        'reg-form__bill-city-cont',
        'reg-form__bill-country-cont',
        'reg-form__bill-postal-cont',
      ],
      regAddressNames: [
        'reg-form__bill-street-input',
        'reg-form__bill-city-input',
        'reg-form__bill-country-input',
        'reg-form__bill-postal-input',
      ],
      regAddressErrorCont: [
        'reg-form__bill-street-error',
        'reg-form__bill-city-error',
        'reg-form__bill-country-error',
        'reg-form__bill-postal-error',
      ],
    },
  ],

  formError: 'form-error',
};

// test text
export const ERROR_MSG = {
  general: ['поля браузер за тебя заполнять будет?', 'без спец.символов, дурачок'],
  email: [
    'а где собака?',
    'а домен где?',
    'хреновый домен, такого нет',
    'англ буквы онли',
    'протестую против пробелов',
  ],
  password: [
    'так-то 8 буковок алё',
    'добавь больших буковок плиз',
    'и маленьких буковок нужно добавить',
    'давай хотя бы одну циферку',
    'пробелов на концах быть не должно',
  ],
  date: ['ты что, дурак? перепроверь год', 'ты еще мелкий, подожди до 13ти лет'],
  postal: [
    'France Postal code must have exactly 5 digits: e.g. F-75012 or 75012',
    'Germany Postal code must have exactly 5 digits: e.g. D-12345 or 12345',
  ],
};
//

export const ADDRESSES_PROPS = [
  { countryName: 'France', postalPattern: '^(F-)?\\d{5}$', postalPH: '75012' },
  { countryName: 'Germany', postalPattern: '^(D-)?\\d{5}$', postalPH: '12345' },
];
