import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Breadcrumb from './breadcrumb_navigation';
import CategoryNavigation from './category_navigation';

export default class CatalogHeader extends BaseElement {
  catalogTitle: BaseElement = new BaseElement({
    tag: 'h2',
    content: 'Products',
    classes: [CLASS_NAMES.catalog.title],
  });

  breadcrumb: Breadcrumb = new Breadcrumb();

  categoryNav: CategoryNavigation;

  constructor() {
    super({ classes: [CLASS_NAMES.catalog.catalogHeader] });

    this.categoryNav = new CategoryNavigation(this.breadcrumb, this.catalogTitle);
    this.categoryNav
      .getCategoryTree()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    this.appendChildren(this.catalogTitle, this.categoryNav);
  }
}
