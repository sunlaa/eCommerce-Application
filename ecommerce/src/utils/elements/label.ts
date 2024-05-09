import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Label extends BaseElement<HTMLLabelElement> {
  constructor(params: ParamsOmitTag<HTMLLabelElement>) {
    super({ tag: 'label', ...params });
  }
}
