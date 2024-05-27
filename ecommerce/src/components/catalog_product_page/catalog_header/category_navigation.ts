import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import Breadcrumb from './breadcrumb_navigation';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Category } from '@commercetools/platform-sdk';
import { CategoryTree } from '@/utils/types_variables/types';
import Router from '@/utils/services/routing';

export default class CategoryNavigation extends BaseElement {
  categoryTree: CategoryTree = {};

  categoryKeyMap: { [key: string]: Category } = {};

  pathToCategory: string[] = [];

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

  async createCategoryTree() {
    const categories = await sdk.getCategories();
    const categoryMap: { [id: string]: Category } = {};

    for (const category of categories) {
      categoryMap[category.id] = category;
      if (category.key) {
        this.categoryKeyMap[category.key] = category;
      }
    }

    for (const category of categories) {
      if (category.ancestors.length === 0 && category.key) {
        this.categoryTree[category.key] = {};
      } else {
        let currentLevel = this.categoryTree;
        for (const ancestor of category.ancestors) {
          const ancestorCategory = categoryMap[ancestor.id];
          if (ancestorCategory && ancestorCategory.key) {
            currentLevel[ancestorCategory.key] = currentLevel[ancestorCategory.key] || {};
            currentLevel = currentLevel[ancestorCategory.key];
          }
        }
        if (category.key) currentLevel[category.key] = currentLevel[category.key] || {};
      }
    }
  }

  findCategory(tree: CategoryTree, key: string): CategoryTree | null {
    if (tree[key]) {
      this.pathToCategory.unshift(key);
      return tree[key];
    }

    for (const category in tree) {
      const result = this.findCategory(tree[category], key);
      if (result) {
        this.pathToCategory.unshift(category);
        return result;
      }
    }

    return null;
  }

  changeCategories = async (key: string = '') => {
    await this.createCategoryTree();

    let ancestorsKeys: string[] = [];
    this.breadcrumb.addLink('All products', '');

    if (key === '') {
      ancestorsKeys = Object.keys(this.categoryTree);
      this.breadcrumb.currentPath.splice(1);
      this.breadcrumb.render();
    } else {
      this.pathToCategory = [];
      const result = this.findCategory(this.categoryTree, key);
      this.breadcrumb.currentPath.splice(1);
      this.pathToCategory.forEach((key) => {
        this.breadcrumb.addLink(this.categoryKeyMap[key].name.en, key);
      });
      if (result) {
        ancestorsKeys = Object.keys(result);
      }
    }

    const newCategories: BaseElement[] = [];

    ancestorsKeys.forEach((key) => {
      newCategories.push(this.createCategoryButton(this.categoryKeyMap[key]));
    });

    this.element.innerHTML = '';
    this.appendChildren(...newCategories);
  };

  createCategoryButton(category: Category) {
    const categotyButton = new BaseElement({
      classes: [CLASS_NAMES.catalog.categoryLink],
      content: category.name.en,
    });
    categotyButton.addListener('click', () => {
      if (!category.key) return;
      Router.navigateTo(`/catalog/${category.key}`);
    });

    return categotyButton;
  }
}
