import './general.sass';
import LoginFormEngine from '@/components/authentication/login/login_engine';
import RegFormEngine from '@/components/authentication/registration/registration_engine';
import CatalogPage from '@/components/catalog_product_page/catalog_page';
import MainPage from '@/components/main_page/main';
import ProfilePage from '@/components/profile_page/profile_page_ui';
import BaseElement from '@/utils/elements/basic_element';
import smoothTransitionTo from '@/utils/functions/smooth_transition_to';
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
    const path = window.location.pathname.slice(1);
    if (path.length === 0) {
      Router.navigateTo('main');
    } else {
      Router.navigateTo(path);
    }
  }

  createRoutes(): Routes[] {
    return [
      {
        path: 'main',
        callback: () => {
          smoothTransitionTo(new MainPage(), this.container);
        },
      },
      {
        path: 'registration',
        callback: () => {
          smoothTransitionTo(new RegFormEngine().regFormEngineStart(), this.container);
        },
      },
      {
        path: 'login',
        callback: () => {
          smoothTransitionTo(new LoginFormEngine().loginFormEngineStart(), this.container);
        },
      },
      {
        path: 'profile',
        callback: () => {
          smoothTransitionTo(new ProfilePage(this.container), this.container);
        },
      },
      {
        path: 'catalog',
        callback: () => {
          smoothTransitionTo(new CatalogPage(), this.container);
        },
      },
    ];
  }
}
