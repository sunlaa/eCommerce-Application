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
    const path = window.location.pathname.slice(1);
    const pathArr = path.split('/');
    console.log(pathArr);

    const result: PathParams = {};
    [result.source, result.category, result.subcategory, result.product] = pathArr;

    // if (result.product && result.subcategory && pathArr.length <= 4) {
    //   path = `${result.source}/{category}/{subcategory}/{product}`;
    // } else if (result.product && pathArr.length <= 4) {
    //   path = `${result.source}/{category}/{product}`;
    // } else if (result.subcategory) {
    //   path = `${result.source}/{category}/{subcategory}`;
    // } else if (result.category) {
    //   path = `${result.source}/{category}`;
    // }

    const route = this.routes.find((item) => item.path === path);

    if (!route) {
      smoothTransitionTo(new Page404());
    } else if (route.path === 'login' && sdk.header.isAtuh) {
      Router.navigateTo('main');
    } else {
      console.log(result.category);
      route.callback(result);
    }
  };

  static navigateTo(path: string) {
    history.pushState(null, '', `${path}`);
    window.dispatchEvent(new Event('popstate'));
  }
}
