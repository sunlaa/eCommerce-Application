import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Loader extends BaseElement {
  constructor() {
    super({ classes: [CLASS_NAMES.loader] });
  }
}
