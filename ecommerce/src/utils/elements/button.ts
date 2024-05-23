import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Button extends BaseElement<HTMLButtonElement> {
  constructor(params: ParamsOmitTag<HTMLButtonElement>) {
    super({ tag: 'button', ...params });
  }

  off() {
    this.element.disabled = true;
  }

  on() {
    this.element.disabled = false;
  }
}
