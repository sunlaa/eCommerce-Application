import { RequiredParamsForLabel } from '../types/types';
import BaseElement from './basic_element';

export default class Label extends BaseElement {
  constructor(params: RequiredParamsForLabel) {
    super({ tag: 'label', ...params });
  }
}
