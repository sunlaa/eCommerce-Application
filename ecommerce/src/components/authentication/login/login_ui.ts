import Anchor from '@/utils/elements/anchor';
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
    this.element.append(emailInput.element, passwordInput.element, logInBtn.element, createAccountBtn.element);
  }
}
