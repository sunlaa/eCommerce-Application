import BaseElement from '@/utils/elements/basic_element';
import InputField from '@/utils/elements/input_field';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class SearchFilter extends InputField {
  loupe: BaseElement;

  constructor() {
    super([CLASS_NAMES.catalog.searchInput], {
      input: { type: 'text', name: 'search', placeholder: 'Search' },
    });

    this.loupe = new BaseElement({
      content: '🔍',
      classes: [CLASS_NAMES.catalog.loupe],
    });

    this.append(this.loupe);
  }

  addListeners(callback: () => void) {
    this.loupe.addListener('click', callback);
    this.input.addListener('keydown', (e: Event) => {
      const event = e as KeyboardEvent;
      if (event.key === 'Enter') {
        event.preventDefault();
        callback();
      }
    });
  }
}
