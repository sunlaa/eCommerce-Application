import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Categories extends BaseElement {
  catalogTitle: BaseElement;

  constructor(catalogTitle: BaseElement) {
    super({ classes: [CLASS_NAMES.catalog.catalogHeader] });
    this.catalogTitle = catalogTitle;
  }
}
