import './general.sass';
import LoginFormEngine from '@/components/authentication/login/login_engine';
import RegFormEngine from '@/components/authentication/registration/registration_engine';
import CatalogPage from '@/components/catalog_product_page/catalog_page';
import MainPage from '@/components/main_page/main';
import BaseElement from '@/utils/elements/basic_element';
import smoothTransitionTo from '@/utils/functions/smooth_transition';
import Router from '@/utils/services/routing';
import { Routes } from '@/utils/types_variables/types';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export const container = new BaseElement({ tag: 'main', classes: [CLASS_NAMES.mainContainer] });

export default class App {
  router: Router;

  catalog: CatalogPage = new CatalogPage();

  constructor() {
    this.router = new Router(this.createRoutes());

    document.body.append(container.element);
  }

  run() {}

  createRoutes(): Routes[] {
    return [
      {
        path: '',
        callback: () => {
          smoothTransitionTo(new MainPage());
        },
      },
      {
        path: 'main',
        callback: () => {
          smoothTransitionTo(new MainPage());
        },
      },
      {
        path: 'registration',
        callback: () => {
          smoothTransitionTo(new RegFormEngine().regFormEngineStart());
        },
      },
      {
        path: 'login',
        callback: () => {
          smoothTransitionTo(new LoginFormEngine().loginFormEngineStart());
        },
      },
      {
        path: 'catalog',
        callback: () => {
          smoothTransitionTo(this.catalog);
        },
      },
    ];
  }
}
