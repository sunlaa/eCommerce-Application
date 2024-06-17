import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class SortFilter extends BaseElement<HTMLSelectElement> {
  constructor() {
    super({ tag: 'select', classes: [CLASS_NAMES.catalog.sortSelect] });

    this.createOptions();
  }

  createOptions() {
    const options: BaseElement<HTMLOptionElement>[] = [];
    const optionsValue = ['id asc', 'price asc', 'price desc', 'name.en asc', 'name.en desc'];

    TEXT_CONTENT.sortOptionsContent.forEach((sortText, i) => {
      options.push(
        new BaseElement<HTMLOptionElement>({
          tag: 'option',
          content: sortText,
          value: optionsValue[i],
        })
      );
    });
    this.appendChildren(...options);
  }
}
