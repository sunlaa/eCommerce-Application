// import LoginFormEngine from '@/components/authentication/login/login_engine';
// import RegFormEngine from '@/components/authentication/registration/registration_engine';
import LoginFormUi from '@/components/authentication/login/login_ui';
import RegFormUi from '@/components/authentication/registration/registration_ui';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import Router from '@/utils/services/routing';
import { Routes } from '@/utils/types_variables/types';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class App {
  container: BaseElement;

  router: Router;

  testElement: Paragraph = new Paragraph('Hello, Echoes of vinyl!', ['test-class']);

  constructor() {
    this.router = new Router(this.createRoutes());
    this.container = new BaseElement({ tag: 'main', classes: [CLASS_NAMES.mainConatiner] });

    document.body.append(this.container.element);
  }

  run() {
    this.router.navigateTo('main');
    // new RegFormEngine().regFormEngineStart(); //reg form render and launch
    // new LoginFormEngine().loginFormEngineStart(); //login form render and launch
  }

  createRoutes(): Routes[] {
    return [
      {
        path: 'main',
        callback: () => {
          this.container.removeChildren();
          this.container.append(this.testElement.element);
        },
      },
      {
        path: 'registration',
        callback: () => {
          this.container.removeChildren();
          this.container.append(new RegFormUi());
        },
      },
      {
        path: 'login',
        callback: () => {
          this.container.removeChildren();
          this.container.append(new LoginFormUi());
        },
      },
    ];
  }
}
