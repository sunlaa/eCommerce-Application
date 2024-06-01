import './catalog_list.sass';
import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, NUMERIC_DATA, TEXT_CONTENT } from '@/utils/types_variables/variables';
import ProductTile from './product_tile/tile';
import Loader from '@/components/general/loader';
import Paragraph from '@/utils/elements/paragraph';

export default class CatalogList extends BaseElement {
  currentFilter: string[] = [];

  currentPage: number = 0;
  currentSort: string | undefined = undefined;
  currentSearch: string | undefined = undefined;

  currentTypeId: string = '';

  loader: Loader = new Loader();
  isLoad: boolean = false;

  noProducts = new Paragraph(TEXT_CONTENT.noProducts, [CLASS_NAMES.catalog.noProduct]);

  constructor() {
    super({ classes: [CLASS_NAMES.catalog.productList] });

    window.addEventListener('wheel', this.infinityLoad);
  }

  infinityLoad = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;

    if (windowHeight + scrollTop >= documentHeight && !this.isLoad) {
      this.isLoad = true;
      this.currentPage += 1;
      this.draw(this.currentFilter, this.currentSort, this.currentSearch)
        .then(() => {
          this.isLoad = false;
        })
        .catch(() => {});
    }
  };

  draw = async (filters: string[], sort?: string, search?: string) => {
    try {
      this.currentFilter = filters;
      this.currentSort = sort;
      this.currentSearch = search;
      this.append(this.loader);
      const body = await sdk.getProductWithFilters(
        filters,
        this.currentPage * NUMERIC_DATA.offset,
        undefined,
        sort,
        search
      );
      const products = body?.results;

      if (body?.total) {
        if (body.total <= this.currentPage * NUMERIC_DATA.offset) {
          window.removeEventListener('wheel', this.infinityLoad);
          this.loader.smoothRemove();
          this.isLoad = false;
          return;
        }
      }

      if (products) {
        if (products.length === 0) {
          this.loader.smoothRemove();
          this.smoothAppearing([this.noProducts]);
          return;
        }

        const tiles: ProductTile[] = [];
        this.currentTypeId = products[0].productType.id;

        products.forEach((data) => {
          tiles.push(new ProductTile(data));
        });
        this.loader.smoothRemove();
        this.smoothAppearing(tiles);
      }
    } catch (err) {
      console.log(err);
    }
  };

  smoothAppearing(tiles: BaseElement[]) {
    tiles.forEach((tile) => tile.setStyles({ opacity: '0' }));
    tiles.forEach((tile, index) => {
      this.append(tile);
      setTimeout(
        () => {
          tile.setStyles({ opacity: '1' });
        },
        (index + 2) * 100
      );
    });
  }

  async redraw(filters: string[], sort?: string, search?: string) {
    this.currentPage = 0;
    window.addEventListener('wheel', this.infinityLoad);
    this.removeChildren();
    await this.draw(filters, sort, search);
  }
}
