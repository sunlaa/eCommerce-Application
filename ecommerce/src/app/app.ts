import './general.sass';
import LoginFormEngine from '@/components/authentication/login/login_engine';
import RegFormEngine from '@/components/authentication/registration/registration_engine';
import MainPage from '@/components/main_page/main';
import BaseElement from '@/utils/elements/basic_element';
import Router from '@/utils/services/routing';
import { Routes } from '@/utils/types_variables/types';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class App {
  container: BaseElement;

  router: Router;

  constructor() {
    this.router = new Router(this.createRoutes());
    this.container = new BaseElement({ tag: 'main', classes: [CLASS_NAMES.mainContainer] });

    document.body.append(this.container.element);
  }

  run() {
    // Для изменения контента внутри main можно изменять строку здесь, в соответсвии с путями ниже
    Router.navigateTo('main');
  }

  createRoutes(): Routes[] {
    return [
      {
        path: 'main',
        callback: () => {
          this.container.removeChildren();
          this.container.append(new MainPage());
        },
      },
      {
        path: 'registration',
        callback: () => {
          this.container.removeChildren();
          this.container.append(new RegFormEngine().regFormEngineStart());
        },
      },
      {
        path: 'login',
        callback: () => {
          this.container.removeChildren();
          this.container.append(new LoginFormEngine().loginFormEngineStart());
        },
      },
    ];
  }
}
