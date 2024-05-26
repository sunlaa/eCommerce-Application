import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Breadcrumb from './breadcrumb_navigation';
import { sdk } from '@/utils/services/SDK/sdk_manager';

type Tree = {
  [category: string]: Tree;
};

export default class CategoryNavigation extends BaseElement {
  categoryTree: Tree = {};

  breadcrumb: Breadcrumb;

  title: BaseElement;

  constructor(breadcrumb: Breadcrumb, title: BaseElement) {
    super({
      classes: [CLASS_NAMES.catalog.categoryNav],
      styles: { display: 'flex', gap: '0.5em', fontWeight: '600', cursor: 'pointer' },
    });

    this.breadcrumb = breadcrumb;
    this.title = title;
  }

  async getCategoryTree() {
    const categories = await sdk.getCategories();

    for await (const category of categories) {
      if (category.ancestors.length === 0) {
        this.categoryTree[category.name.en] = {};
      } else {
        const ancestorCategory = await sdk.getCategoryById(category.ancestors[0].id);
        if (ancestorCategory) {
          this.categoryTree[ancestorCategory.name.en][category.name.en] = {};
        }
      }
    }
    return this.categoryTree;
  }

  // async changeCategoryButtons(key: string) {
  //   const categories = await sdk.getCategories();
  // }

  // async createCategoryButton(key: string) {
  //   const category = await sdk.getCategoryByKey(key);
  //   if (!category) {
  //     Router.navigateTo('unexist');
  //     return;
  //   }
  //   const result = new BaseElement({ classes: [CLASS_NAMES.catalog.categoryLink], content: category.name.en });
  //   return result;
  // }
}
