import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';
import Breadcrumb from './navigation/breadcrumb_navigation';
import CategoryNavigation from './navigation/category_navigation';

export default class CatalogHeader extends BaseElement {
  catalogTitle: BaseElement = new BaseElement({
    tag: 'h2',
    classes: [CLASS_NAMES.catalog.title],
  });

  breadcrumb: Breadcrumb = new Breadcrumb();

  categories: CategoryNavigation;

  constructor() {
    super({ classes: [CLASS_NAMES.catalog.catalogHeader] });

    this.categories = new CategoryNavigation(this.breadcrumb, this.catalogTitle);
    this.appendChildren(this.catalogTitle, this.breadcrumb, this.categories);
  }

  smoothAppearing(key?: string) {
    setTimeout(() => {
      this.categories.setStyles({ opacity: '0' });
      this.catalogTitle.setStyles({ opacity: '0' });

      setTimeout(() => {
        this.categories.changeCategories(key).catch((err) => console.log(err));
        this.categories.setStyles({ opacity: '1' });
        this.catalogTitle.setStyles({ opacity: '1' });
      }, NUMERIC_DATA.animationDuration);
    }, 0);
  }
}
