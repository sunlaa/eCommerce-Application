import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import InputField from '@/utils/elements/input_field';
import Section from '@/utils/elements/section';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class LoginFormUi extends Form {
  formLogin: LoginFormUi;
  loginPage: HTMLElement;

  constructor() {
    super({
      classes: [CLASS_NAMES.login.loginForm],
    });
    this.spawnForm();

    this.formLogin = this;

    const sectionLoginPage = new Section({ classes: [CLASS_NAMES.login.loginPageContainer] });
    sectionLoginPage.appendChildren(
      new BaseElement({ tag: 'h2', content: TEXT_CONTENT.titleLoginPage, classes: [CLASS_NAMES.login.title] }),
      this.formLogin
    );
    this.loginPage = sectionLoginPage.element;
  }

  spawnForm() {
    const emailInput = new InputField([CLASS_NAMES.login.emailInput], {
      label: { content: 'E-mail' },
      input: {
        name: CLASS_NAMES.regFormInputNames[0],
        id: CLASS_NAMES.regFormInputNames[0],
        type: 'text',
        placeholder: TEXT_CONTENT.loginNamePH,
      },
      error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.login.emailError] },
    });
    const passwordInput = new InputField([CLASS_NAMES.login.passwordInput], {
      label: { content: 'Password' },
      input: {
        name: CLASS_NAMES.regFormInputNames[1],
        id: CLASS_NAMES.regFormInputNames[1],
        type: 'password',
        placeholder: TEXT_CONTENT.loginPasswordPH,
      },
      error: { classes: [CLASS_NAMES.formError, CLASS_NAMES.login.passwordError] },
    });

    const togglePasswordBtn = new BaseElement({
      content: '👁️',
      classes: [CLASS_NAMES.login.togglePasswordBtn],
    });

    togglePasswordBtn.addListener('click', (event) => {
      event.preventDefault();
      passwordInput.togglePasswordVisibility();
      const inputType = passwordInput.input.getElement().type;
      togglePasswordBtn.content = inputType === 'password' ? '👁️' : '🔒';
    });
    passwordInput.wrapper.append(togglePasswordBtn);

    const buttonsContainer = new BaseElement({ classes: [CLASS_NAMES.login.buttonsContainer] });
    const submit = new BaseElement<HTMLInputElement>({
      tag: 'input',
      classes: [CLASS_NAMES.login.logInBtn],
      type: 'submit',
      value: TEXT_CONTENT.loginSubmitBtn,
    });

    const createAccountText = new BaseElement(
      {
        tag: 'p',
        classes: [CLASS_NAMES.login.createAccountText],
        content: TEXT_CONTENT.goToRegText,
      },
      new Anchor({
        href: 'registration',
        content: TEXT_CONTENT.loginRegisterBtn,
        classes: [CLASS_NAMES.login.createAccountBtn],
      })
    );

    buttonsContainer.appendChildren(submit, createAccountText);
    this.inputFields.push(emailInput, passwordInput);
    this.appendChildren(emailInput, passwordInput, buttonsContainer);
  }
}
