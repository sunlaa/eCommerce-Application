import SDKManager from '@/utils/services/SDK/sdk_manager';
import FormValidation from '../validation_engine';
import LoginFormUi from './login_ui';

export default class LoginFormEngine extends LoginFormUi {
  container: HTMLElement = document.body; // should be main

  sdk: SDKManager;

  validInstance: FormValidation = new FormValidation();

  constructor(sdk: SDKManager) {
    super();
    this.sdk = sdk;

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

      const data = this.getData();

      this.sdk.login({ email: data.email, password: data.password });
    });
  }

  loginFormEngineStart() {
    this.container.innerHTML = '';
    this.container.append(this.formLogin.element);
  }
}
