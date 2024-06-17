import Router from '../services/routing';
import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Anchor extends BaseElement<HTMLAnchorElement> {
  href: string;

  constructor(params: ParamsOmitTag<HTMLAnchorElement>, ...child: BaseElement[]) {
    super({ tag: 'a', ...params }, ...child);
    this.href = this.element.href;

    this.addListener('click', this.clickListener);
  }

  clickListener = (e: Event) => {
    e.preventDefault();
    const path = this.href;
    Router.navigateTo(path);
  };
}
