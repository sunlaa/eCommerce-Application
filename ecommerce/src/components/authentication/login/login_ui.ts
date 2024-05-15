import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import Button from '@/utils/elements/button';
import Form from '@/utils/elements/form';
import InputField from '@/utils/elements/input_field';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

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
        name: CLASS_NAMES.login.emailInput,
        id: 'email',
        type: 'text',
        placeholder: 'Enter your email',
      },
      error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.login.emailError] },
    });
    const passwordField = new BaseElement({ classes: [CLASS_NAMES.login.passwordField] });
    const passwordInput = new InputField([CLASS_NAMES.login.passwordInput], {
      label: {},
      input: {
        name: 'password',
        id: 'password',
        type: 'password',
        placeholder: 'Enter your password',
      },
      error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.login.passwordError] },
    });

    const togglePasswordBtn = new Button({
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

    const logInBtn = new Anchor({
      href: '#main',
      content: 'Log In',
      classes: [CLASS_NAMES.login.logInBtn],
    });

    const createAccountBtn = new Anchor({
      href: '#registration',
      content: 'Create account',
      classes: [CLASS_NAMES.login.createAccountBtn],
    });

    this.inputFields.push(emailInput, passwordInput);
    this.appendChildren(emailInput, passwordField, logInBtn, createAccountBtn);
  }
}
