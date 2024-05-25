import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Breadcrumb from './breadcrumb_navigation';
import CategoryNavigation from './category_navigation';

export default class Categories extends BaseElement {
  catalogTitle: BaseElement = new BaseElement({
    tag: 'h2',
    content: 'Products',
    classes: [CLASS_NAMES.catalog.title],
  });

  breadcrumb: Breadcrumb = new Breadcrumb();

  constructor() {
    super({ classes: [CLASS_NAMES.catalog.catalogHeader] });
    this.appendChildren(this.catalogTitle, this.breadcrumb, new CategoryNavigation(this.breadcrumb, this.catalogTitle));
  }
}
