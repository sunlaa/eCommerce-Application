import './general.sass';
import LoginFormEngine from '@/components/authentication/login/login_engine';
import RegFormEngine from '@/components/authentication/registration/registration_engine';
import CatalogPage from '@/components/catalog_product_page/catalog_page';
import MainPage from '@/components/main_page/main';
import ProfilePage from '@/components/profile_page/profile_page_ui';
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
    const path = window.location.pathname.slice(1);
    if (path.length === 0) {
      Router.navigateTo('main');
    } else {
      Router.navigateTo(path);
    }
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
        path: 'profile',
        callback: () => {
          this.smoothTransitionTo(new ProfilePage());
        },
      },
      {
        path: 'catalog',
        callback: () => {
          this.smoothTransitionTo(new CatalogPage());
        },
      },
    ];
  }
}
