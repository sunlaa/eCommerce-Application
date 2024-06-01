import Page404 from '@/components/not_found_page/not_found';
import { PathParams, Routes } from '../types_variables/types';
import { sdk } from './SDK/sdk_manager';
import smoothTransitionTo from '../functions/smooth_transition';

export default class Router {
  routes: Routes[];

  constructor(routes: Routes[]) {
    this.routes = routes;
    window.addEventListener('DOMContentLoaded', this.hashHandler);
    window.addEventListener('popstate', this.hashHandler);
  }

  private hashHandler = () => {
    let path = window.location.pathname.slice(1);
    const pathArr = path.split('/');

    const result: PathParams = {};
    [result.source, result.category, result.product] = pathArr;

    if (pathArr.length > 3) {
      smoothTransitionTo(new Page404());
      return;
    } else if (result.product) {
      path = `${result.source}/{category}/{product}`;
    } else if (result.category) {
      path = `${result.source}/{category}`;
      sdk.checkIfCategoryExist(result.category).catch(() => {
        smoothTransitionTo(new Page404());
      });
    }

    const route = this.routes.find((item) => item.path === path);

    if (!route) {
      smoothTransitionTo(new Page404());
    } else if (route.path === 'login' && sdk.header.isAtuh) {
      Router.navigateTo('main');
    } else {
      route.callback(result);
    }
  };

  static navigateTo(path: string) {
    history.pushState(null, '', `${path}`);
    window.dispatchEvent(new Event('popstate'));
  }
}
