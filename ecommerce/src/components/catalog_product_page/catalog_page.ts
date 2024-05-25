import Section from '@/utils/elements/section';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Categories from './catalog_header/categories';

export default class CatalogPage extends Section {
  constructor() {
    super({ classes: [CLASS_NAMES.catalog.catalogPage] });
    this.appendChildren(new Categories());
  }
}
