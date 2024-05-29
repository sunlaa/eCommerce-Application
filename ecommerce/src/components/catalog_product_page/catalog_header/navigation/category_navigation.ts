import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import Breadcrumb from './breadcrumb_navigation';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { Category } from '@commercetools/platform-sdk';
import { CategoryTree } from '@/utils/types_variables/types';
import Anchor from '@/utils/elements/anchor';
import CatalogList from '../../catalog_list/list';

export default class CategoryNavigation extends BaseElement {
  categoryTree: CategoryTree = {};

  categoryKeyMap: { [key: string]: Category } = {};

  pathToCategory: string[] = [];

  breadcrumb: Breadcrumb;

  title: BaseElement;

  list: CatalogList;

  constructor(breadcrumb: Breadcrumb, title: BaseElement, list: CatalogList) {
    super({
      classes: [CLASS_NAMES.catalog.categoryNav],
    });

    this.breadcrumb = breadcrumb;
    this.title = title;
    this.list = list;
  }

  changeCategories = async (key: string = '') => {
    if (Object.keys(this.categoryTree).length === 0) await this.createCategoryTree();

    let childKeys: string[] = [];
    this.breadcrumb.addLink(TEXT_CONTENT.allProduct, '');

    if (key === '') {
      childKeys = Object.keys(this.categoryTree);

      this.breadcrumb.currentPath.splice(1);
      this.breadcrumb.render();

      this.title.content = TEXT_CONTENT.allProduct;

      this.list.draw(this.getIdFilter(childKeys));
    } else {
      this.pathToCategory = [];
      const result = this.findCategory(this.categoryTree, key);

      if (!result) return;

      this.breadcrumb.currentPath.splice(1);
      this.pathToCategory.forEach((key) => {
        this.breadcrumb.addLink(this.categoryKeyMap[key].name.en, key);
      });

      const name = this.categoryKeyMap[key].name.en;
      this.title.content = name;

      childKeys = Object.keys(result);

      this.list.draw(this.getIdFilter([key]));
    }

    const newCategories: BaseElement[] = [];

    childKeys.forEach((key) => {
      newCategories.push(this.createCategoryButton(this.categoryKeyMap[key]));
    });

    this.element.innerHTML = '';
    this.appendChildren(...newCategories);
  };

  createCategoryButton(category: Category) {
    const categotyButton = new Anchor({
      href: `/catalog/${category.key}`,
      classes: [CLASS_NAMES.catalog.categoryLink],
      content: category.name.en,
    });

    return categotyButton;
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

  getIdFilter(keys: string[]) {
    const subtree = (string: string) => `subtree("${string}"), `;
    let result = 'categories.id: ';
    keys.forEach((key) => {
      result += `${subtree(this.categoryKeyMap[key].id)}`;
    });
    return [result.trim().slice(0, -1)];
  }
}
