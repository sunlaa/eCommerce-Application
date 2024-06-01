import './product_page.sass';
import ProductPageUI from './product_page_ui';
import { Product, ProductType } from '@commercetools/platform-sdk';

export default class ProductPageEngine extends ProductPageUI {
  constructor(product: Product, productType: ProductType) {
    super(product, productType);
  }

  productPageEngineStart() {
    return this.element;
  }
}
