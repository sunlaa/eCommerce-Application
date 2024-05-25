import BaseElement from '@/utils/elements/basic_element';
import Section from '@/utils/elements/section';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Categories from './catalog_header/categories';

export default class CatalogPage extends Section {
  catalogTitle: BaseElement = new BaseElement({ tag: 'h2', classes: [CLASS_NAMES.catalog.title] });

  constructor() {
    super({ classes: [CLASS_NAMES.catalog.catalogPage] });
    this.appendChildren(this.catalogTitle, new Categories(this.catalogTitle));
  }
}
