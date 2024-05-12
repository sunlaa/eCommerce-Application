// import LoginFormEngine from '@/components/authentication/login/login_engine';
// import RegFormEngine from '@/components/authentication/registration/registration_engine';
import Paragraph from '@/utils/elements/paragraph';

export default class App {
  container: HTMLElement = document.body;

  testElement: Paragraph = new Paragraph('Hello, Echoes of vinyl!', ['test-class']);

  run() {
    this.container.append(this.testElement.element);

    // new RegFormEngine().regFormEngineStart(); //reg form render and launch

    // new LoginFormEngine().loginFormEngineStart(); //login form render and launch
  }
}
