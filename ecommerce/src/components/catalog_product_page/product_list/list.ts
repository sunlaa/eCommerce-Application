import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class ProductList extends BaseElement {
  constructor() {
    super({ classes: [CLASS_NAMES.catalog.productList] });
  }
}
