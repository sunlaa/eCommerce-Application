import Button from '@/utils/elements/button';
import FormValidation from '../validation_engine';
import LoginFormUi from './login_ui';
import RegFormEngine from '../registration/registration_engine';

export default class LoginFormEngine extends LoginFormUi {
  container: HTMLElement = document.body; // should be main
  createAccountBtn: Button = new Button({ content: 'Create Account', classes: ['create-account-btn'] });
  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();

    this.formLogin.inputFields.forEach((inputField) => {
      inputField.input.addListener('input', () => {
        this.validInstance.validate(inputField);
      });
    });

    this.createAccountBtn.addListener('click', () => {
      new RegFormEngine().regFormEngineStart();
    });
  }

  loginFormEngineStart() {
    this.container.innerHTML = '';
    this.container.append(this.formLogin.element, this.createAccountBtn.element);
  }
}
