import Form from '@/utils/elements/form';
import InputField from '@/utils/elements/input_field';

export default class LoginFormUi extends Form {
  formLogin: LoginFormUi;

  constructor() {
    super({
      classes: ['login-form'],
    });
    this.spawnForm();

    this.formLogin = this;
  }

  spawnForm() {
    const emailInput = new InputField(['email-input'], {
      label: {},
      input: {
        name: 'email',
        id: 'email',
        type: 'email',
        placeholder: 'Enter your email',
      },
      error: { classes: ['form-error', 'email-error'] },
    });
    const passwordInput = new InputField(['password-input'], {
      label: {},
      input: {
        name: 'password',
        id: 'password',
        type: 'password',
        placeholder: 'Enter your password',
      },
      error: { classes: ['form-error', 'password-error'] },
    });
    const logInBtn = new InputField(['submit-btn'], {
      label: { content: '' },
      input: {
        name: 'submit',
        type: 'submit',
        value: 'Log In',
      },
    });

    this.inputFields.push(emailInput, passwordInput);
    this.element.append(emailInput.element, passwordInput.element, logInBtn.element);
  }
}
