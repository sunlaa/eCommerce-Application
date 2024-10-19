import './slider_section.sass';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import ProductTile from '@/components/catalog_product_page/catalog_list/product_tile/tile';
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
      'categories.id: subtree("ac939f86-b550-4f85-9412-d5cf8cdec146")',
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
