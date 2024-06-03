import './catalog_page.sass';
import Section from '@/utils/elements/section';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import CatalogHeader from './catalog_header/catalog_header';
import CatalogList from './catalog_list/list';

export default class CatalogPage extends Section {
  catalogHeader: CatalogHeader;

  catalogList: CatalogList;

  constructor() {
    super({
      classes: [CLASS_NAMES.catalog.catalogPage],
    });

    this.catalogList = new CatalogList();
    this.catalogHeader = new CatalogHeader(this.catalogList);

    this.appendChildren(this.catalogHeader, this.catalogList);
  }
}
