import ProductPageUI from './product_page_ui';
import { Product } from '@commercetools/platform-sdk';

export default class ProductPageEngine extends ProductPageUI {
  constructor(productData: Product) {
    super(productData);
  }

  productPageEngineStart() {
    return this.element;
  }
}
