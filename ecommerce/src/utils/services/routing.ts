import Page404 from '@/components/not_found_page/not_found';
import { Routes } from '../types_variables/types';
import { sdk } from './SDK/sdk_manager';

export default class Router {
  routes: Routes[];

  constructor(routes: Routes[]) {
    this.routes = routes;

    window.addEventListener('hashchange', this.hashHandler);
  }

  private hashHandler = () => {
    const path = location.hash.slice(1);

    const route = this.routes.find((item) => item.path === path);

    if (!route) {
      const main = document.querySelector('main');
      if (main && main instanceof HTMLElement) {
        main.innerHTML = '';
        main.append(new Page404().element);
      }
    } else if (route.path === 'login' && sdk.header.isAtuh) {
      Router.navigateTo('main');
    } else {
      route.callback();
    }
  };

  static navigateTo(path: string) {
    window.location.hash = '';
    window.location.hash = path;
  }
}
