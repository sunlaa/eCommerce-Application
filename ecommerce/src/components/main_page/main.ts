import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Hero from './hero_container/hero';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import Slider from './slider/slider';
import ProductTile from '../catalog_product_page/catalog_list/product_tile/tile';

export default class MainPage extends BaseElement {
  constructor() {
    super({ tag: 'section', classes: [CLASS_NAMES.main.mainPage] }, new Hero());

    void this.addSlider();
  }

  addSlider = async () => {
    const products = await sdk.getProductWithFilters([]);
    if (products?.results) {
      const some = products.results.slice(0, 3);
      const tiles = some.map((data) => new ProductTile(data));
      this.append(new Slider(tiles));
    }
  };
}
