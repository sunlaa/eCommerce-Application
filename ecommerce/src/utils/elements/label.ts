import { ParamsOmitTag } from '../types/types';
import BaseElement from './basic_element';

export default class Label extends BaseElement<HTMLLabelElement> {
  constructor(params: ParamsOmitTag<HTMLLabelElement>) {
    super({ tag: 'label', ...params });
  }
}
