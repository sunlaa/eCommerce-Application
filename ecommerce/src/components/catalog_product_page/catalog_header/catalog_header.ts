import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, NUMERIC_DATA } from '@/utils/types_variables/variables';
import Breadcrumb from './navigation/breadcrumb_navigation';
import CategoryNavigation from './navigation/category_navigation';
import CatalogList from '../catalog_list/list';
import Filter from './filter/filter';

export default class CatalogHeader extends BaseElement {
  catalogTitle: BaseElement = new BaseElement({
    tag: 'h2',
    classes: [CLASS_NAMES.catalog.title],
  });

  breadcrumb: Breadcrumb = new Breadcrumb();

  categories: CategoryNavigation;

  filter: Filter;

  catalogList: CatalogList;

  constructor(list: CatalogList) {
    super({ classes: [CLASS_NAMES.catalog.catalogHeader] });

    this.catalogList = list;
    this.filter = new Filter(list);
    this.categories = new CategoryNavigation(this.breadcrumb, this.catalogTitle, this.catalogList, this.filter);
    this.appendChildren(this.catalogTitle, this.breadcrumb, this.categories, this.filter);
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
