import './general.sass';
import LoginFormEngine from '@/components/authentication/login/login_engine';
import RegFormEngine from '@/components/authentication/registration/registration_engine';
import MainPage from '@/components/main_page/main';
import Page404 from '@/components/not_found_page/not_found';
import BaseElement from '@/utils/elements/basic_element';
import Router from '@/utils/services/routing';
import { Routes } from '@/utils/types_variables/types';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';

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

  private smoothTransitionTo(page: BaseElement | HTMLElement) {
    let element: HTMLElement;
    if (page instanceof BaseElement) {
      element = page.element;
    } else {
      element = page;
    }

    this.container.setStyles({ opacity: '0' });

    setTimeout(() => {
      this.container.removeChildren();
      this.container.append(element);
      this.container.setStyles({ opacity: '1' });
    }, NUMERIC_DATA.animationDuration);
  }

  createRoutes(): Routes[] {
    return [
      {
        path: 'main',
        callback: () => {
          this.smoothTransitionTo(new MainPage());
        },
      },
      {
        path: 'registration',
        callback: () => {
          this.smoothTransitionTo(new RegFormEngine().regFormEngineStart());
        },
      },
      {
        path: 'login',
        callback: () => {
          this.smoothTransitionTo(new LoginFormEngine().loginFormEngineStart());
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
