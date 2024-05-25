import BaseElement from '@/utils/elements/basic_element';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import { Category } from '@commercetools/platform-sdk';
import Breadcrumb from './breadcrumb_navigation';

export default class CategoryNavigation extends BaseElement {
  breadcrumb: Breadcrumb;

  title: BaseElement;

  constructor(breadcrumb: Breadcrumb, title: BaseElement) {
    super({ classes: [CLASS_NAMES.catalog.categoryNav] });

    this.breadcrumb = breadcrumb;
    this.title = title;
    this.fillNavigation().catch((err) => console.log(err));
  }

  fillNavigation = async (ancestor?: string) => {
    const results: BaseElement[] = [];
    const categories = await sdk.getCategories();

    categories.forEach((category) => {
      if (ancestor) {
        category.ancestors.forEach((anc) => {
          anc.id === ancestor ? results.push(this.createCategoryButton(category)) : null;
        });
      } else {
        category.ancestors.length === 0 ? results.push(this.createCategoryButton(category)) : null;
      }
    });

    this.element.innerHTML = '';
    this.appendChildren(...results);
  };

  createCategoryButton = (category: Category) => {
    const result = new BaseElement({
      classes: [CLASS_NAMES.catalog.categoryLink],
      content: category.name.en,
    });

    result.addListener('click', () => {
      this.fillNavigation(category.id)
        .then(() => {
          this.breadcrumb.addLink(category.name.en);
          this.title.content = category.name.en;
        })
        .catch((err) => console.log(err));
    });
    return result;
  };
}
