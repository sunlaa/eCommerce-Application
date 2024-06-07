import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';

export default class Loader extends BaseElement {
  constructor() {
    super({ classes: [CLASS_NAMES.loader] });
  }

  smoothRemove() {
    setTimeout(() => {
      this.setStyles({ opacity: '0' });
      setTimeout(() => {
        this.remove();
        this.setStyles({ opacity: '1' });
      }, NUMERIC_DATA.animationDuration);
    }, 0);
  }
}
