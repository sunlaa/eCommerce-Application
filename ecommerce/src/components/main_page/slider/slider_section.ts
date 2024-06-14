import './slider_section.sass';
import ProductTile from '@/components/catalog_product_page/catalog_list/product_tile/tile';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Slider from '../../../utils/elements/slider';
import SliderTurns from './slider_turns';

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
    const products = await sdk.getProductWithFilters([
      'categories.id: subtree("d133b7b1-0c42-4c9e-bff5-f36234a75b77")',
    ]);
    if (products?.results) {
      const results = products.results;
      const tiles = results.map((data) => new ProductTile(data));
      const images = tiles.map((tile) => tile.mainImage.cloneElement());
      const slider = new Slider(tiles);
      this.appendChildren(slider, new SliderTurns(slider, images));
    }
  };
}
