import LoginFormUi from '@/components/authentication/login/login_ui';
import RegFormUi from '@/components/authentication/registration/registration_ui';
import Header from '@/components/general/header/header';
import Page404 from '@/components/not_found_page/not_found';
import BaseElement from '@/utils/elements/basic_element';
import Paragraph from '@/utils/elements/paragraph';
import Router from '@/utils/services/routing';
import { Routes } from '@/utils/types_variables/types';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class App {
  container: BaseElement;

  header: Header = new Header();

  router: Router;

  testElement: Paragraph = new Paragraph('Hello, Echoes of vinyl!', ['test-class']);

  constructor() {
    this.router = new Router(this.createRoutes());
    this.container = new BaseElement({ tag: 'main', classes: [CLASS_NAMES.mainConatiner] });

    document.body.append(this.header.forUnauthorized(), this.container.element);
  }

  run() {
    // Для изменения контента внутри main можно изменять строку здесь, в соответсвии с путями ниже
    this.router.navigateTo('main');
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
      {
        path: '404',
        callback: () => {
          this.container.removeChildren();
          this.container.append(new Page404());
        },
      },
    ];
  }
}
