import { Routes } from '../types_variables/types';

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
      this.navigateTo('404');
    } else {
      route.callback();
    }
  };

  navigateTo(path: string) {
    window.location.hash = '';
    window.location.hash = path;
  }
}