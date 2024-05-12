import BaseElement from '@/utils/elements/basic_element';

export default class Page404 extends BaseElement {
  constructor() {
    super({ tag: 'h1', content: 'Sorry, the requested page does not exist ' });
  }
}
