import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import ProductTile from './product_tile/tile';

export default class CatalogList extends BaseElement {
  constructor() {
    super({ classes: [CLASS_NAMES.catalog.productList] });
  }

  draw(filters: string[]) {
    sdk
      .getProductWithFilters(filters)
      .then((products) => {
        console.log('Products: ', products);
        if (products) {
          this.removeChildren();
          products.forEach((data) => {
            this.append(new ProductTile(data));
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
