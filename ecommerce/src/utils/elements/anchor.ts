import { RequiredParamsForAnchor } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Anchor extends BaseElement<HTMLAnchorElement> {
  constructor(params: RequiredParamsForAnchor) {
    super({ tag: 'a', ...params });
  }
}