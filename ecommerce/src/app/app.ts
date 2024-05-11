import LoginFormEngine from '@/components/authentication/login/login_engine';
import Button from '@/utils/elements/button';
import Paragraph from '@/utils/elements/paragraph';

export default class App {
  container: HTMLElement = document.body;

  testElement: Paragraph = new Paragraph('Hello, Echoes of vinyl!', ['test-class']);

  loginButton: Button = new Button({
    content: 'Sign In',
    classes: ['sign-in-btn'],
    onclick: () => {
      new LoginFormEngine().loginFormEngineStart();
    },
  });

  main: HTMLElement = document.createElement('main');

  run() {
    this.container.append(this.testElement.element, this.main);
    this.main.append(this.loginButton.element);
  }
}
