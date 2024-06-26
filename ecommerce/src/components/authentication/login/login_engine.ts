import { sdk } from '@/utils/services/SDK/sdk_manager';
import FormValidation from '../validation_engine';
import LoginFormUi from './login_ui';
import './login.sass';
import Router from '@/utils/services/routing';
import { notification } from '@/components/general/notification/notification';
import { TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class LoginFormEngine extends LoginFormUi {
  container: HTMLElement = document.body; // should be main

  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();

    this.formLogin.inputFields.forEach((inputField) => {
      inputField.input.addListener('input', () => {
        this.validInstance.validate(inputField, null);
      });
    });

    this.formLogin.addListener('submit', (event) => {
      event.preventDefault();

      let isError = false;
      this.formLogin.inputFields.forEach((inputField) => {
        if (this.validInstance.validate(inputField, null)) isError = true;
      });

      if (isError) return;

      this.serverHandle().catch((err) => console.log(err));
    });
  }

  async serverHandle() {
    const data = this.getData();

    const errorMessage = await sdk.login({ email: data.email, password: data.password });

    if (errorMessage.length !== 0) {
      notification.showError(errorMessage);
      return;
    }

    Router.navigateTo('main');

    sdk.header.switchToAuthorized();
    notification.showSuccess(TEXT_CONTENT.successLogin);
  }

  loginFormEngineStart() {
    return this.loginPage;
  }
}
