import './catalog_page.sass';
import Section from '@/utils/elements/section';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import CatalogHeader from './catalog_header/catalog_header';

export default class CatalogPage extends Section {
  catalogHeader: CatalogHeader;

  constructor() {
    super({
      classes: [CLASS_NAMES.catalog.catalogPage],
    });
    this.catalogHeader = new CatalogHeader();
    // this.categories = catalogHeader.categories;

    this.appendChildren(this.catalogHeader);
  }
}
