export const TEXT_CONTENT = {
  // register page
  inputNames: ['E-mail', 'Password', 'First name', 'Last name', 'Date of birth'],
  inputPHs: ['example@gmail.com', 'Qwerty12345', 'Mike', 'Shinoda', '2011-01-01'],

  inputAddressShip: 'Shipping Address',
  inputAddressBill: 'Billing Address',

  inputAddressNames: ['Street', 'City', 'Country', 'Postal code'],
  inputAddressPHs: ['Baker str.', 'London', 'France', '75012'],

  inputCheckbox: 'Shipping and billing addresses are the same',
  inputDefaultCheckbox: 'Set addresses as default',
  inputRegBtn: 'Sign Up',

  // login page
  loginNamePH: 'Enter your email',
  loginPasswordPH: 'Enter your password',

  loginSubmitBtn: 'Log in',
  loginRegisterBtn: 'Sign up',

  // pages titles
  titleRegPage: 'Sign Up to Get Started',
  titleLoginPage: 'Let’s Get Started',

  // main page
  mainTextAbout:
    'Here you can purchase vinyl records of your favorite artists. Immerse yourself in a vintage vibe with "Echoes of vinyl".',
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
  regFormInputNames: ['email', 'password', 'name', 'surname', 'date', 'sameCheckbox', 'defaultCheckbox'],
  regFormErrorCont: [
    'reg-form__email-error',
    'reg-form__password-error',
    'reg-form__name-error',
    'reg-form__surname-error',
    'reg-form__date-error',
  ],
  regFormCheckboxName: 'reg-form__check-box-name',
  regFormCheckboxNameDefault: 'reg-form__check-box-name-default',
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
      regAddressNames: ['ship-street', 'ship-city', 'ship-country', 'ship-postal'],
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
      regAddressNames: ['bill-street', 'bill-city', 'bill-country', 'bill-postal'],
      regAddressErrorCont: [
        'reg-form__bill-street-error',
        'reg-form__bill-city-error',
        'reg-form__bill-country-error',
        'reg-form__bill-postal-error',
      ],
    },
  ],
  formError: 'form-error',
  mainContainer: 'main-container',
  regPageContainer: 'reg-page-container',
  link: 'link',
  header: {
    headerContainer: 'header',
    toMainLink: 'header__to-main-link',
    navButtonsCont: 'header__nav-buttons',
    login: 'header__login-btn',
    reg: 'header__reg-btn',
    logout: 'header__logout-btn',
  },
  login: {
    loginPageContainer: 'login-page-container',
    loginForm: 'login-form',
    emailInput: 'login-form__email-input',
    passwordField: 'login-form__password-field',
    passwordInput: 'login-form__password-input',
    logInBtn: 'login-form__login-btn',
    createAccountBtn: 'login-form__create-account-btn',
    passwordError: 'login-form__password-error',
    emailError: 'login-form__email-error',
    togglePasswordBtn: 'login-form__toggle-password-btn',
    buttonsContainer: 'login-form__buttons-container',
  },
  main: {
    mainPage: 'main-page',
    heroContainer: 'main-page__hero',
    aboutContainer: 'main-page__about',
    title: 'main-page__title',
    aboutText: 'main-page__text',
    authBtnContainer: 'main-page__btn-container',
  },
};

export const ERROR_MSG = {
  general: ['Please, fill the field', 'Special characters or numbers are not supported'],
  email: [
    'Email address must contain an "@" symbol separating local part and domain name',
    'Email name length could be more than 1 character',
    'Email address must contain a domain name (e.g., domain.com)',
    'Domain name is incorrect',
    'Email address must not contain special symbols except "@", ".", "-" and "_"',
    'Email address must contain only English letters',
    'Email address must not contain whitespaces',
  ],
  password: [
    'Password must be at least 8 characters long',
    'Password must contain at least one uppercase letter (A-Z)',
    'Password must contain at least one lowercase letter (a-z)',
    'Password must contain at least one digit (0-9)',
    'Password must not contain whitespace',
  ],
  date: ['Year cannot be less than 1900 and more than the current year', 'User must be above a 13 years old or older'],
  postal: [
    'France Postal code must have exactly 5 digits: e.g. F-75012 or 75012',
    'Germany Postal code must have exactly 5 digits: e.g. D-12345 or 12345',
  ],
};

export const SERVER_ERROR_MSG = {
  email: 'This email address has not been registered',
  password: 'Incorrect password',
};

export const ADDRESSES_PROPS = [
  { countryName: 'France', postalPattern: '^(F-)?\\d{5}$', postalPH: '75012', countryCode: 'FR' },
  { countryName: 'Germany', postalPattern: '^(D-)?\\d{5}$', postalPH: '12345', countryCode: 'DE' },
];
