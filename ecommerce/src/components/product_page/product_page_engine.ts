import { sdk } from '@/utils/services/SDK/sdk_manager';
import './product_page.sass';
import ProductPageUI from './product_page_ui';

export default class ProductPageEngine {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  async getProductPage() {
    const product = await sdk.getProductByKey(this.key);
    if (!product) return;
    const productType = await sdk.getProductTypeById(product.productType.id);

    return new ProductPageUI(product, productType);
  }
}
