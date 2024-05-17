import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Section extends BaseElement {
  constructor(params: ParamsOmitTag) {
    super({ tag: 'section', ...params });
  }
}
