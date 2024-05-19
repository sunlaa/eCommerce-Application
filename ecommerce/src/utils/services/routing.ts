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
      Router.navigateTo('404');
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
