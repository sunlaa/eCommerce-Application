import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Input extends BaseElement<HTMLInputElement> {
  constructor(params: ParamsOmitTag<HTMLInputElement>) {
    super({ tag: 'input', autocomplete: 'off', ...params });
  }

  get value() {
    return this.element.value;
  }

  set value(text: string) {
    this.element.value = text;
  }

  get type() {
    return this.element.type;
  }

  get name() {
    return this.element.name;
  }

  getDataAttribute(data: string) {
    const value = this.element.dataset[data];
    if (value) {
      return value;
    } else {
      return '';
    }
  }

  focus() {
    this.element.focus();
  }

  clear() {
    this.element.value = '';
  }

  off() {
    this.element.disabled = true;
  }

  on() {
    this.element.disabled = false;
  }
}
