import Router from '../services/routing';
import { RequiredParamsForAnchor } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Anchor extends BaseElement<HTMLAnchorElement> {
  href: string;

  constructor(params: RequiredParamsForAnchor) {
    super({ tag: 'a', ...params });
    this.href = params.href;

    this.addListener('click', this.clickListener);
  }

  clickListener = (e: Event) => {
    e.preventDefault();
    const path = this.href;
    Router.navigateTo(path);
  };
}
