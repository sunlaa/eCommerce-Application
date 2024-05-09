import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';

export default class Form extends BaseElement<HTMLFormElement> {
  constructor(params: ParamsOmitTag, ...child: BaseElement[]) {
    super({ tag: 'form', ...params }, ...child);
  }

  getData = () => {
    const data: { [key: string]: string } = {};
    const formData = new FormData(this.element);
    const iterator = formData.entries();
    for (const entity of iterator) {
      const key = entity[0];
      const value = entity[1];
      if (typeof value === 'string') {
        data[key] = value;
      }
    }
    return data;
  };
}
