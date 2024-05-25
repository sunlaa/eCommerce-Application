import Page404 from '@/components/not_found_page/not_found';
import { Routes } from '../types_variables/types';
import { sdk } from './SDK/sdk_manager';
import { NUMERIC_DATA } from '../types_variables/variables';

export default class Router {
  routes: Routes[];

  constructor(routes: Routes[]) {
    this.routes = routes;
    window.addEventListener('popstate', this.hashHandler);
  }

  private hashHandler = () => {
    const path = window.location.pathname.slice(1);

    const route = this.routes.find((item) => item.path === path);

    if (!route) {
      const main = document.querySelector('main');
      if (main && main instanceof HTMLElement) {
        main.style.opacity = '0';
        setTimeout(() => {
          main.innerHTML = '';
          main.append(new Page404().element);
          main.style.opacity = '1';
        }, NUMERIC_DATA.animationDuration);
      }
    } else if (route.path === 'login' && sdk.header.isAtuh) {
      Router.navigateTo('main');
    } else {
      route.callback();
    }
  };

  static navigateTo(path: string) {
    if (path[0] === '/') {
      const currentUrl = window.location.pathname;
      const url = `${currentUrl}${path}`;
      window.history.pushState(null, '', `${url}`);
      window.dispatchEvent(new Event('popstate'));
      return;
    }

    window.history.pushState(null, '', `${path}`);
    window.dispatchEvent(new Event('popstate'));
  }
}
