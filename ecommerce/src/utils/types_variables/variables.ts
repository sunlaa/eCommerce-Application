export const TEXT_CONTENT = {
  // register page
  inputNames: ['E-mail:', 'Password:', 'First name:', 'Last name:', 'Date of birth:'],
  inputPHs: ['example@gmail.com', 'Qwerty12345', 'Mike', 'Shinoda', '2011-01-01'],

  inputAddressShip: 'Shipping Address',
  inputAddressBill: 'Billing Address',

  inputAddressNames: ['Street:', 'City:', 'Country:', 'Postal code:', 'Set as default'],
  inputAddressPHs: ['Baker str.', 'London', 'France', '75012'],

  inputCheckbox: 'Shipping and billing addresses are the same',
  inputDefaultCheckbox: 'Set addresses as default',
  inputRegBtn: 'Sign Up',
  alreadyHave: 'Already have an account? ',

  // login page
  loginNamePH: 'Enter your email',
  loginPasswordPH: 'Enter your password',

  loginSubmitBtn: 'Log in',

  goToRegText: 'No account yet? Create a ',
  loginRegisterBtn: 'new one.',

  // pages titles
  titleRegPage: 'Sign Up to Get Started',
  titleLoginPage: "Let's Get Started",

  // main page
  mainTextAbout:
    'Discover the echoes of your favorite music at "Echoes of Vinyl", where we offer a curated selection of records from vintage classics to cutting-edge releases.',
  mainPromoInfoMainTitle: ['Are you true RSS enjoyer?', 'Want to enjoy music, but have nothing to play it?'],
  mainPromoInfoSubTitle: [
    'You will get 20% discount for your cart total price after you apply the "RSSTheBest" promo code',
    '"Gift" will be added to your cart after you apply the "STARTERPACK" promo code',
  ],
  mainPromoInfoDescr: ['20% OFF', 'GIFT'],
  mainModalBtn: 'Close',

  // 404 page
  errorText: "Uh-oh, we can't find the page you're looking for 🙁. It probably doesn't exist.",

  // notification
  successReg: 'You have successfully registered. You are now logged in.',
  successLogin: 'You have successfully logged in.',
  successMainInfoEdited: 'Your main profile data has been successfully changed.',
  successPasswordEdited: 'Your password has been successfully changed.',
  successAddressRemoved: 'Address has been deleted successfully.',
  successAddressEdited: 'Address has been edited successfully.',
  successAddressAdded: 'Address has been added successfully.',
  successPromoCodeAdded: 'Promocode has been activated successfully.',
  successCheckout: 'Your order is accepted! Our operator will contact you to confirm the details.',

  // header
  header: {
    login: 'Log in',
    reg: 'Sign up',
    catalog: 'Catalog',
    profile: 'Profile',
    about: 'About Us',
  },

  // profile
  profileTitle: 'Profile Information',
  profileProps: ['firstName', 'lastName', 'email', 'dateOfBirth', 'addresses'],
  profileAddresses: ['postalCode', 'country', 'city', 'streetName'],
  profileFields: {
    firstName: 'Name',
    lastName: 'Surname',
    email: 'E-mail',
    dateOfBirth: 'Date Of Birth',
    addresses: ['Shipping Addresses', 'Billing Addresses'],
  },
  profileEditBtn: 'Edit',
  profileSaveBtn: 'Save',
  profileChangePassword: 'Change Password',

  profilePasswordManager: {
    passwordFormLabels: ['Current Password', 'New Password', 'Confirm New Password'],
    passwordFormNames: ['currentPassword', 'newPassword', 'confirmPassword'],
    passwordFormPH: ['Qwerty1234', 'qWERTY4321', 'qWERTY4321'],
  },
  addressDefault: '(Default)',

  //address manager
  addrManagerTitle: 'Addresses Manager',
  managerFormNames: ['streetName', 'city', 'country', 'postalCode'],
  managerFormLabels: ['Street', 'City', 'Country', 'Postal Code'],
  managerAddBtn: '+Add',
  managerPH: 'Choose existing address to update it or add the new one',
  managerDefaultCheckBox: 'Default Address: ',
  managerDeleteBtn: 'Delete Address',
  managerEditBtn: 'Edit Address',
  hiddenInputName: 'addressId',
  managerBackBtn: '← Back',

  // catlog
  allProduct: 'All Products',
  noProducts: 'No results found',
  resetFilters: 'Reset all filters',
  unFilteredAttributes: ['tracks'],
  sortOptionsContent: ['Deafault', 'Price ⬆', 'Price ⬇', 'Name A-Z', 'Name Z-A'],

  // cart
  cartTitle: 'My Cart',
  cartPromoInfoMainTitle2: 'Add a gift to your order?',
  cartPromoInfoSubTitle2: '"Gift" will be added to your basket after you apply the promo code "STARTERPACK"',
  cartEmptyMessage: 'Your cart is empty for now',
  cartEmptyBtn: 'Start shopping 🛒',
  cartClearModalBtn: 'Clear Shopping Cart',
  cartClearMessage: 'Are you sure you want to clear your Cart?',
  cartClearConfirm: 'Yes',
  cartClearCancel: 'No',
  cartPromoCodes: ['RSSTheBest', 'STARTERPACK'],
  cartPromoWrong: 'Promo Code is not valid',
  cartPromoEmpty: 'Please enter promo code',
  cartSubtotalTitle: 'Subtotal',
  cartPromoAdd: '+',
  cartPromoRemove: '❌',
  cartPromoLabel: 'Promo code:',
  cartPromoInputName: 'promocode',
  cartPromoInputPH: 'PROMO99',
  cartCheckoutBtn: 'Checkout',
  cartShoppingBtn: 'Or continue shopping',

  //about
  aboutCollaboration:
    'Our project thrived on the strength of our collaboration. We consistently supported each other, tackling challenges together and celebrating successes. Sharing tips and insights helped us collectively improve our coding skills. We utilized JIRA to track tasks efficiently and held daily stand-ups to monitor progress and address issues promptly. We fostered a culture of innovation, encouraging new ideas and collaboratively finding solutions to complex problems. This teamwork led to the successful creation of our project, demonstrating the power of united efforts and shared vision. Through our journey, we not only developed a functional and innovative product but also strengthened our bonds as a team.',
};

export const NUMERIC_DATA = { animationDuration: 200, offset: 6, descriptionCharCount: 100, sliderFlipInterval: 5000 };

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
  regFormInputNames: ['email', 'password', 'firstName', 'lastName', 'dateOfBirth', 'sameCheckbox', 'defaultCheckbox'],
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
        'reg-form__ship-default',
      ],
      regAddressNames: ['shipStreet', 'shipCity', 'shipCountry', 'shipPostalCode', 'shipDefault'],
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
        'reg-form__bill-default',
      ],
      regAddressNames: ['billStreet', 'billCity', 'billCountry', 'billPostalCode', 'billDefault'],
      regAddressErrorCont: [
        'reg-form__bill-street-error',
        'reg-form__bill-city-error',
        'reg-form__bill-country-error',
        'reg-form__bill-postal-error',
      ],
    },
  ],
  reg: {
    addressTitle: 'reg-form__address-title',
    regInputField: 'reg-form__input-field',
    loginBtn: 'reg-form__login-btn',
    btnContainer: 'reg-form__btn-container',
    haveAccountText: 'reg-form__have-account-text',
  },
  formError: 'form-error',
  mainContainer: 'main-container',
  regPageContainer: 'reg-page-container',
  link: 'link',
  header: {
    headerContainer: 'header',
    toMainLink: 'header__to-main-link',
    navButtonsCont: 'header__nav-buttons',
    mainLinksContainer: 'header__main-buttons',
    personalLinksContainer: 'header__personal-buttons',

    button: 'header__button',
    link: 'header__link',

    login: 'header__login-btn',
    reg: 'header__reg-btn',
    logout: 'header__logout-btn',
    catalog: 'header__catalog-btn',
    profile: 'header__profile-btn',
    about: 'header__about-btn',

    burgerWrapper: 'header__burger-wrapper',
    burgerBtn: 'header__burger-btn',
    burgerBtnOpen: 'menu-opened',

    cart: 'header__cart-btn',
    cartCounter: 'header__cart-counter',
    counterText: 'header__counter-text',
  },
  footer: {
    footerContainer: 'footer',
    rsLogoContainer: 'footer__logo',
    wrapper: 'footer__wrapper',
    linksContainer: 'footer__links-container',
    copyrightContainer: 'footer__copyright-container',
    section: 'footer__section',
    team: 'footer__team',
    sectionTitle: 'footer__section-title',
    rsLink: 'footer__rs-link',
    rsImg: 'footer__rs-image',
    sectionLink: 'footer__link',
    copyright: 'footer__copyright',
    copyrightIcon: 'footer__copyright-icon',
  },

  ghLink: {
    link: 'gh-link',
    icon: 'gh-link__icon',
    text: 'gh-link__text',
  },

  rsLogo: {
    rsLink: 'rs-link',
    rsImage: 'rs-image',
  },

  slider: {
    slider: 'slider',
    sliderFrame: 'slider__frame',
    sliderLine: 'slider__line',
    sliderItem: 'slider__item',
    lArrow: 'slider__l-arrow',
    rArrow: 'slider__r-arrow',

    sliderTurns: 'slider-turns-container',
    sliderTurn: 'slider-turn',
  },

  login: {
    loginPageContainer: 'login-page-container',
    loginForm: 'login-form',
    title: 'login-page-container__title',
    emailInput: 'login-form__email-input',
    passwordField: 'login-form__password-field',
    passwordInput: 'login-form__password-input',
    logInBtn: 'login-form__login-btn',
    createAccountBtn: 'login-form__create-account-btn',
    passwordError: 'login-form__password-error',
    emailError: 'login-form__email-error',
    togglePasswordBtn: 'login-form__toggle-password-btn',
    buttonsContainer: 'login-form__buttons-container',
    createAccountText: 'login-form__create-account-text',
  },
  main: {
    mainPage: 'main-page',
    heroContainer: 'main-page__hero',
    heroOverlay: 'main-page__hero-overlay',
    video: 'main-page__video',
    aboutContainer: 'main-page__about',
    title: 'main-page__title',
    aboutText: 'main-page__text',
    catalogBtn: 'main-page__catalog-btn',

    sliderSection: 'main-page__slider-section',
    sliderTitle: 'main-page__slider-title',

    promo: 'main-page__promo',
    promoCont: 'main-page__promo-cont',
    promoDescr: 'main-page__promo-descr',
    promoModal: 'main-page__promo-modal',
    promoModalBtn: 'main-page__promo-modal-btn',
  },
  errorPage: {
    errorPage: 'error-page',
    errorImage: 'error-page__image',
    errorTextContainer: 'error-page__text-container',
    errorTitle: 'error-page__title',
    errorText: 'error-page__text',
    goHomeBtn: 'error-page__home-button',
  },
  inputValid: 'input-valide',
  inputInvalid: 'input-invalide',
  notification: {
    container: 'notification',
    title: 'notification__tittle',
    text: 'notification__text',
  },
  catalog: {
    catalogPage: 'catalog-page',
    title: 'catalog-page__title',

    breadcrumb: 'catalog-page__breadcrumb',
    separator: 'catalog-page__breadcrumb-separator',
    breadcrumbLink: 'catalog-page__breadcrumb-link',

    categoryNav: 'catalog-page__category-nav',
    categoryLink: 'catalog-page__category-link',
    catalogHeader: 'catalog-page__header',

    productList: 'catalog-page__list',
    noProduct: 'catalog-page__no-product',
    productTile: 'catalog-page__tile',
    producImageContainer: 'catalog-page__tile-image-container',
    productImage: 'catalog-page__tile-image',
    secondImage: 'catalog-page__second-image',
    productInfo: 'catalog-page__tile-info',
    productBrief: 'catalog-page__tile-brief',
    productName: 'tile-brief__name',
    productDescription: 'tile-brief__description',
    productPriceContainer: 'catalog-page__tile-price-container',
    prefix: 'tile-price-container__prefix',
    actualPrice: 'tile-price-container__actual',
    withDiscount: 'with-discount',
    discountPrice: 'tile-price-container__discount',
    vinylImg: 'tile__vinyl-image',
    tileCartManager: 'tile__cart-manager',
    colorContainer: 'tile__color-container',
    colorItem: 'tile_color-item',
    addToCart: 'tile__add-to-cart',
    addToCartImage: 'tile__add-to-cart-image',

    filter: 'catalog-page__filter',

    generalContainer: 'catalog-page__general-container',
    filtersContainer: 'catalog-page__filters-container',
    searchSortContainer: 'catalog-page__sesrch-sort-container',

    filterTitle: 'catalog-page__filter-title',

    sortSelect: 'catalog-page__sort-select',
    searchInput: 'catalog-page__search-input',
    loupe: 'search-input__loupe',

    resetFilters: 'catalog-page__reset-button',

    selectFilterContainer: 'catalog-page__select-filter-container',
    selsectArrow: 'catalog-page__select-arrow',
    selectForm: 'catalog-page__select-form',
    selectCheckbox: 'catalog-page__select-checkbox',

    rangeFilterContainer: 'catalog-page__range-filter-container',
    sliderContainer: 'catalog-page__slider-container',
    rangeSlider: 'catalog-page__range-slider-form',
    rangeValueContainer: 'catalog-page__range-value-container',

    selectedContainer: 'catalog-page__selected-container',
    selectedBadge: 'selected-container__badge',
    badgeCross: 'selected-container__cross',
  },
  profile: {
    profilePage: 'profile-page',
    profileContMain: 'profile__cont-main',
    profileContSum: 'profile__cont-sum',
    profileContDetailed: 'profile__cont-detailed',
    profileSumWrapper: 'profile-sum__wrapper',
    profileSumAvatar: 'profile-sum__avatar',
    profileSumInfo: 'profile-sum__info',
    profileEditPasswordBtn: 'profile-sum__change-password-btn',
    profilePasswordForm: 'profile-sum__password-form',
    passwordFieldsCont: 'profile-sum__password-field-cont',
    passwordSubmitBtn: 'profile-sum__confirm-password-btn',

    profileDetailedAdressesCont: 'profile-detailed__addr-cont',
    profileContentField: 'profile-detailed__content-field',
    defaultAddressPH: 'address-title',
    defaultAddress: 'default-address',
    profileManagerBtn: 'profile-detailed__manager-btn',
  },

  addrManager: {
    managerPage: 'manager-page',
    managerContMain: 'manager__cont-main',
    managerContSum: 'manager__cont-sum',
    managerContDetailed: 'manager__cont-detailed',
    managerContentField: 'manager-detailed__content-field',
    defaultCheckBoxCont: 'manager-detailed__dflt-checkbox',
    defaultCheckBoxName: 'defaultCheckBox',
    managerBtnsCont: 'manager-detailed__btns-cont',
    managerEmpty: 'manager-detailed__empty',
    managerBackBtn: 'manager__back-btn',
    selectedAddress: 'selected-address',
    managerNewAddTitle: 'manager-detailed__new-addr-title',
  },

  product: {
    productPage: 'product-page',
    productSection: 'product-page__section',
    productImgContainer: 'product-page__img-container',
    productImgSliderButtonPrev: 'product-page__img-slider-button-prev',
    productImgSliderButtonNext: 'product-page__img-slider-button-next',
    productImgSliderContainer: 'product-page__img-slider-container',
    productAllImg: 'product-page__all-img',
    productSmallImg: 'product-page__small-img',
    productSmallImgContainer: 'product-page__small-img-container',
    productImg: 'product-page__img',
    productInfoContainer: 'product-page__info-container',
    productTitle: 'product-page__title',
    productPrice: 'product-page__price',
    productColor: 'product-page__color',
    productDescription: 'product-page__description',
    productTracks: 'product-page__tracks',
    productYear: 'product-page__year',
    selectVariantFormDropdown: 'product-page__dropdown',
    productTracksContainer: 'product-page__tracks-container',
    discountPrice: 'product-page__discount-price',
    withDiscount: 'with-discount',
    addToCartButton: 'product-page__add-to-cart-button',
    removeFromCartButton: 'product-page__remove-from-cart-button',
  },
  modal: {
    modal: 'modal',
    closeButton: 'modal__close-button',
    imageSlider: 'modal__image-slider',
    open: 'open',
    navigationContainer: 'modal__navigation-container',
    prevButton: 'modal__prev-button',
    nextButton: 'modal__next-button',
  },
  loader: 'loader',

  about: {
    section: 'about-page__section',
    aboutPage: 'about-page',
    aboutTitle: 'about-page__title',
    memberContainer: 'about-page__member-container',

    bioContainer: 'about-page__bio-container',
    memberName: 'about-page__member-name',
    memberRole: 'about-page__member-role',

    assetsContainer: 'about-page__assets-container',
    memberImage: 'about-page__member-image',

    descriptionContainer: 'about-page__description',
    memberBio: 'about-page__member-bio',
    memberContribution: 'about-page__member-contribution',
    members: 'about-page__members',

    collaborationContainer: 'about-page__collaboration-container',
    wrapper: 'about-page__collaboration-wrapper',
    collaborationItems: 'about-page__collaboration-items-container',

    collaborationItem: 'about-page__collaboration-item',
    itemTitle: 'collaboration-item__title',
    itemImage: 'collaboration-item__image',
    itemText: 'collaboration-item__text',
    // collaborationText: 'about-page__collaboration-text',
  },

  cart: {
    cartPage: 'cart-page',
    cartPromoInfoCont: 'cart__promo-info-cont',
    cartMainCont: 'cart__main-cont',
    cartListContWrapper: 'cart__list-cont-wrapper',
    cartListCont: 'cart__list-cont',
    cartTotalCont: 'cart__total-cont',
    cartListTHead: ['\u00A0', 'Product', 'Price', 'Quantity', 'Total', '\u00A0'],
    cartEmptyCont: 'cart__empty-cont',
    cartClearModalCont: 'cart__clear-modal-cont',
    cartTrGift: 'cart__list-tr-gift',
    cartTdCover: 'cart__list-td-cover',
    cartTdName: 'cart__list-td-name',
    cartTdSwitcher: 'cart__list-td-switcher',
    cartTdTotalPrice: 'cart__list-rd-total-price',
    cartTdRemove: 'cart__list-td-remove',
    cartTotalPrice: 'cart__total-price',
    cartTotalPriceCont: 'cart__total-price-cont',
    cartTotalSavedPrice: 'cart__total-saved-price',
    cartTotalInputCont: 'cart__total-input-cont',
    cartTotalPromocodeActive: 'cart__total-promo-active-cont',
    cartRecordLine: 'record-line',
    cartRedPrice: 'red-price',
  },
};
export const teamMembers = [
  {
    name: 'Lada Santalava',
    role: 'Team Lead / Developer',
    image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Uladzislava.jpeg?raw=true',
    bio: '<i>Lada excels at crafting seamless user interfaces. She has been interested in coding since her school days and continuously strives to expand her knowledge.</i>',
    contribution: [
      'Set up the repository and <b>task board</b>.',
      'Implement website <b>Routing</b>.',
      'Developed a component for integrating <b>commercetools SDK</b>.',
      'Designed and implemented the <b>«Main»</b> page.',
      'Created a <b>«Catalog»</b> page with intuitive filters.',
    ],
    github: 'https://github.com/sunlaa',
    gitName: 'sunlaa',
  },
  {
    name: 'Katsiaryna Stanevich',
    role: 'Frontend Developer',
    image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Katsiaryna.jpeg?raw=true',
    bio: '<i>Katsiaryna is passionate about creating user-friendly and visually appealing web applications. She is improving her coding skills through continuous learning.</i>',
    contribution: [
      'Wrote code to <b>load products</b> into commercetools.',
      'Developed a secure <b>«Login»</b> page.',
      'Implemented a <b>«Detalied Product»</b> page.',
      '<b>Assisted in the expansion</b> of an SDK integration component.',
      'Created a visually appealing <b>«About Us»</b> page.',
    ],
    github: 'https://github.com/katyastan',
    gitName: 'katyastan',
  },
  {
    name: 'Pavel Terno',
    role: 'Frontend Developer',
    image: 'https://github.com/sunlaa/commerce-images/blob/main/others/members/Pavel.png?raw=true',
    bio: '<i>Pavel is an enthusiastic developer with a passion for creating functional websites. He is always eager to learn new technologies and improve his coding skills.</i>',
    contribution: [
      'Created a robust <b>Validation component</b>.',
      'Develop a <b>«Registration»</b> page.',
      'Crafted a user-friendly <b>«Profile»</b> page.',
      '<b>Contributed to extending</b> a versatile SDK component.',
      'Designed and implemented a streamlined shopping <b>«Cart»</b> page.',
    ],
    github: 'https://github.com/pahanchickt',
    gitName: 'pahanchickt',
  },
];

export const collaborationData = [
  {
    title: 'Support',
    image: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/collaboration/support.png',
    text: 'We constantly supported each other, solved problems together, and celebrated successes together.',
  },
  {
    title: 'Insights',
    image: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/collaboration/share.png',
    text: 'Sharing tips and insights helped us collectively improve our coding skills and work more effectively together.',
  },
  {
    title: 'Scrum',
    image: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/collaboration/scrum.png',
    text: 'Our team utilized SCRUM methodology and held daily meetings to resolve issues quickly.',
  },
  {
    title: 'New ideas',
    image: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/collaboration/idea.png',
    text: 'We encourage new ideas and the collaborative search for solutions to complex problems.',
  },
  {
    title: 'Result',
    image: 'https://raw.githubusercontent.com/sunlaa/commerce-images/main/others/collaboration/collaboration.png',
    text: 'Our collaborative efforts led to excellent results and strengthened our team bond.',
  },
];

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
    `Passwords entered in "${TEXT_CONTENT.profilePasswordManager.passwordFormLabels[1]}" and "${TEXT_CONTENT.profilePasswordManager.passwordFormLabels[2]}" are mismatch`,
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
