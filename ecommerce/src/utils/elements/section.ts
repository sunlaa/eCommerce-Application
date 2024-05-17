import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Section extends BaseElement<HTMLButtonElement> {
  constructor(params: ParamsOmitTag<HTMLButtonElement>) {
    super({ tag: 'section', ...params });
  }
}
