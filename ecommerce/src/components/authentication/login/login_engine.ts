import FormValidation from '../validation_engine';
import LoginFormUi from './login_ui';
import './login.sass';

export default class LoginFormEngine extends LoginFormUi {
  container: HTMLElement = document.body; // should be main

  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();

    this.formLogin.inputFields.forEach((inputField) => {
      inputField.input.addListener('input', () => {
        this.validInstance.validate(inputField);
      });
    });

    this.formLogin.addListener('submit', (event) => {
      event.preventDefault();

      let isError = false;
      this.formLogin.inputFields.forEach((inputField) => {
        if (this.validInstance.validate(inputField)) isError = true;
      });

      if (isError) return;
      // send data
    });
  }

  loginFormEngineStart() {
    return this.loginPage;
  }
}
