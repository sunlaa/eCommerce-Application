import Button from '@/utils/elements/button';
import FormValidation from '../validation_engine';
import LoginFormUi from './login_ui';
import RegFormEngine from '../registration/registration_engine';

export default class LoginFormEngine {
  container: HTMLElement = document.querySelector('main')!;
  formLogin: LoginFormUi = new LoginFormUi();
  createAccountBtn: Button = new Button({ content: 'Create Account', classes: ['create-account-btn'] });
  validInstance: FormValidation = new FormValidation();

  constructor() {
    this.formLogin.element.querySelectorAll('input').forEach((input) => {
      input.oninput = () => {
        this.validInstance.validate(this.formLogin.element);
      };
    });
    this.createAccountBtn.element.onclick = () => {
      new RegFormEngine().regFormEngineStart();
    };
  }

  loginFormEngineStart() {
    this.container.innerHTML = '';
    this.container.append(this.formLogin.element, this.createAccountBtn.element);
  }
}
