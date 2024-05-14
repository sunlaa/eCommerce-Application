import FormValidation from '../validation_engine';
import LoginFormUi from './login_ui';

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
  }

  loginFormEngineStart() {
    this.container.innerHTML = '';
    this.container.append(this.formLogin.element);
  }
}
