import Section from '@/utils/elements/section';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import CatalogHeader from './catalog_header/catalog_header';
import CategoryNavigation from './catalog_header/category_navigation';

export default class CatalogPage extends Section {
  categoryNav: CategoryNavigation;

  constructor() {
    super({ classes: [CLASS_NAMES.catalog.catalogPage] });
    const catalogHeader = new CatalogHeader();
    this.categoryNav = catalogHeader.categoryNav;

    this.appendChildren(catalogHeader);
  }
}
