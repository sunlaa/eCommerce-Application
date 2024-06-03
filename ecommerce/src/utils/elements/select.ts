import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Select extends BaseElement<HTMLSelectElement> {
  constructor(params: ParamsOmitTag<HTMLSelectElement>) {
    super({ tag: 'select', ...params });
  }
}
