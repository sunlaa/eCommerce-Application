import Router from '../services/routing';
import { RequiredParamsForAnchor } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Anchor extends BaseElement<HTMLAnchorElement> {
  constructor(params: RequiredParamsForAnchor) {
    super({ tag: 'a', ...params });

    this.addListener('click', (e) => {
      e.preventDefault();
      // const index = this.element.href.lastIndexOf('/');
      const path = params.href;
      Router.navigateTo(path);
    });
  }
}
