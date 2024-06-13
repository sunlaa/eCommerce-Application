import ProductTile from '@/components/catalog_product_page/catalog_list/product_tile/tile';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Slider from './slider';

export default class SliderSection extends BaseElement {
  constructor() {
    super(
      { classes: [CLASS_NAMES.main.sliderSection] },
      new BaseElement({
        tag: 'h2',
        classes: [CLASS_NAMES.main.sliderTitle],
        content: "Our customer's favorite records",
      })
    );

    void this.addSlider();
  }

  addSlider = async () => {
    const products = await sdk.getProductWithFilters([]);
    if (products?.results) {
      const some = products.results;
      const tiles = some.map((data) => new ProductTile(data));
      this.append(new Slider(tiles));
    }
  };
}
