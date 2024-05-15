import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import InputField from '@/utils/elements/input_field';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class LoginFormUi extends Form {
  formLogin: LoginFormUi;

  constructor() {
    super({
      classes: [CLASS_NAMES.login.loginForm],
    });
    this.spawnForm();

    this.formLogin = this;
  }

  spawnForm() {
    const emailInput = new InputField([CLASS_NAMES.login.emailInput], {
      label: {},
      input: {
        name: CLASS_NAMES.regFormInputNames[0],
        id: CLASS_NAMES.regFormInputNames[0],
        type: 'text',
        placeholder: TEXT_CONTENT.loginNamePH,
      },
      error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.login.emailError] },
    });
    const passwordField = new BaseElement({ classes: [CLASS_NAMES.login.passwordField] });
    const passwordInput = new InputField([CLASS_NAMES.login.passwordInput], {
      label: {},
      input: {
        name: CLASS_NAMES.regFormInputNames[1],
        id: CLASS_NAMES.regFormInputNames[1],
        type: 'password',
        placeholder: TEXT_CONTENT.loginPasswordPH,
      },
      error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.login.passwordError] },
    });

    const togglePasswordBtn = new BaseElement({
      content: '👁️‍🗨️',
      classes: [CLASS_NAMES.login.togglePasswordBtn],
    });

    togglePasswordBtn.addListener('click', (event) => {
      event.preventDefault();
      passwordInput.togglePasswordVisibility();
      const inputType = passwordInput.input.getElement().type;
      togglePasswordBtn.content = inputType === 'password' ? '👁️‍🗨️' : '🔒';
    });
    passwordField.appendChildren(passwordInput, togglePasswordBtn.getElement());

    const logInBtn = new InputField([CLASS_NAMES.login.logInBtn], {
      input: {
        type: 'submit',
        value: TEXT_CONTENT.loginSubmitBtn,
      },
      error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.regFormErrorGeneral] },
    });

    const createAccountBtn = new Anchor({
      href: '#registration',
      content: TEXT_CONTENT.loginRegisterBtn,
      classes: [CLASS_NAMES.login.createAccountBtn],
    });

    this.inputFields.push(emailInput, passwordInput);
    this.appendChildren(emailInput, passwordField, logInBtn, createAccountBtn);
  }
}
