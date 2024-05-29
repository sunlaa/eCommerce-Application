import './catalog_list.sass';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';
import ProductTile from './product_tile/tile';
import Loader from '@/components/general/loader';

export default class CatalogList extends BaseElement {
  currentFilter: string[] = [];

  currentPage: number = 0;

  loader: Loader = new Loader();
  isLoad: boolean = false;

  constructor() {
    super({ classes: [CLASS_NAMES.catalog.productList] });

    window.addEventListener('scroll', this.infinityLoad);
  }

  infinityLoad = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;

    if (windowHeight + scrollTop >= documentHeight && !this.isLoad) {
      this.isLoad = true;
      this.currentPage += 1;
      this.draw(this.currentFilter)
        .then(() => {
          this.isLoad = false;
        })
        .catch(() => {
          window.removeEventListener('scroll', this.infinityLoad);
          this.loader.remove();
          this.isLoad = false;
        });
    }
  };

  draw = async (filters: string[]) => {
    try {
      this.currentFilter = filters;
      this.append(this.loader);
      const products = await sdk.getProductWithFilters(filters, this.currentPage * NUMERIC_DATA.offset);
      if (products) {
        const tiles: ProductTile[] = [];
        products.forEach((data) => {
          tiles.push(new ProductTile(data));
        });
        this.loader.remove();
        this.smoothAppearing(tiles);
      }
    } catch {
      throw Error;
    }
  };

  smoothAppearing(tiles: ProductTile[]) {
    tiles.forEach((tile) => tile.setStyles({ opacity: '0' }));
    tiles.forEach((tile, index) => {
      this.append(tile);
      setTimeout(
        () => {
          tile.setStyles({ opacity: '1' });
        },
        (index + 1) * 100
      );
    });
  }

  redraw(filters: string[]) {
    this.currentPage = 0;
    console.log('redraw');
    window.addEventListener('scroll', this.infinityLoad);
    this.removeChildren();
    this.draw(filters).catch(() => {});
  }
}