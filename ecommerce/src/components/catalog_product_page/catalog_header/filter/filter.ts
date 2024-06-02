import './filter.sass';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import CatalogList from '../../catalog_list/list';
import CheckboxesFilter from './filters/checkboxes_filter';
import BaseElement from '@/utils/elements/basic_element';
import { getAttributeFilter } from '@/utils/functions/get_filters';
import RangeFilter from './filters/range_filter';
import InputField from '@/utils/elements/input_field';
import { ProductProjection } from '@commercetools/platform-sdk';
import addUnique from '@/utils/functions/fill_arr_unique';
import getMinMax from '@/utils/functions/get_min_max';
import SortFilter from './filters/sort';
import SearchFilter from './filters/search';

export default class Filter extends BaseElement {
  container: BaseElement = new BaseElement({ classes: [CLASS_NAMES.catalog.generalContainer] });

  filtersContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.filtersContainer] });
  searchSortContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.searchSortContainer] });
  selectedFiltersContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.selectedContainer] });

  allProducts: ProductProjection[] | null = null;

  list: CatalogList;
  initialCategoryFilter: string[];

  sortSelect: BaseElement<HTMLSelectElement>;
  searchInput: InputField;

  rangeInputs: RangeFilter[] = [];
  selectInputs: CheckboxesFilter[] = [];

  constructor(list: CatalogList) {
    super({ classes: [CLASS_NAMES.catalog.filter] });

    this.initialCategoryFilter = list.currentFilter;
    this.list = list;

    this.sortSelect = this.createSortSelect();
    this.searchInput = this.createSearchInput();
    this.searchSortContainer.appendChildren(this.searchInput, this.sortSelect);

    this.container.appendChildren(this.filtersContainer, this.searchSortContainer);

    this.appendChildren(this.container, this.selectedFiltersContainer);
  }

  updateProducts = () => {
    const query = this.getQueryArray();
    const sort = this.sortSelect.element.value;
    const search = this.searchInput.input.value;
    this.list.redraw(query, sort, search).catch((err) => console.log(err));
    console.log(query, sort, search);
  };

  async changeFilters(typeID: string[]) {
    if (typeID.length > 1) {
      this.clear();
      return;
    }
    const productType = await sdk.getProductTypeById(typeID[0]);

    if (!productType || !productType.attributes) return;

    this.clear();

    await this.addPriceFilter();

    for await (const attribute of productType.attributes) {
      if (TEXT_CONTENT.unFilteredAttributes.includes(attribute.name)) continue;

      const data = await this.getAttributesPossibleValue(attribute.name);

      if (attribute.type.name === 'text') {
        const select = new CheckboxesFilter(
          attribute.label.en,
          attribute.name,
          data as string[],
          this.selectedFiltersContainer
        );

        select.addInputHandler(this.updateProducts);

        this.selectInputs.push(select);
        this.filtersContainer.append(select);
      } else if (attribute.type.name === 'number') {
        const minmax = getMinMax(data as number[]);
        const range = new RangeFilter(attribute.label.en, attribute.name, minmax);

        range.addInputHandler(this.updateProducts);

        this.rangeInputs.push(range);
        this.filtersContainer.append(range);
      }
    }
  }

  getQueryArray() {
    const data = this.getFilterInputsData();
    const result = [...this.initialCategoryFilter];

    Object.keys(data).forEach((attributeName) => {
      if (data[attributeName].type === 'text') {
        const values: string[] = [];
        let name: string = '';
        let attrQuery: string = '';
        Object.keys(data[attributeName]).forEach((value) => {
          if (value !== 'type') {
            values.push(value);
            name = attributeName;
            attrQuery = getAttributeFilter(name, values);
          }
        });
        if (attrQuery !== '') result.push(attrQuery);
      }
      if (data[attributeName].type === 'number') {
        if (attributeName === 'price') {
          result.push(`variants.price.centAmount:range (${data[attributeName].min} to ${data[attributeName].max})`);
        } else {
          result.push(
            `variants.attributes.${attributeName}:range (${data[attributeName].min} to ${data[attributeName].max})`
          );
        }
      }
    });
    return result;
  }

  async addPriceFilter() {
    const data = await this.getAttributesPossibleValue('price');

    const minmax = getMinMax(data as number[]);
    const range = new RangeFilter('Variants price', 'price', minmax, '€');

    range.addInputHandler(this.updateProducts);

    this.rangeInputs.push(range);
    this.filtersContainer.append(range);
  }

  async getAllProducts() {
    if (this.allProducts) return;
    const response = await sdk.getProductWithFilters(this.list.currentFilter, undefined, 0);
    if (!response) return;

    const totalCount = response.total;
    const productData = await sdk.getProductWithFilters(this.list.currentFilter, undefined, totalCount);
    if (!productData) return;

    this.allProducts = productData.results;
  }

  async getAttributesPossibleValue<Key>(name: string) {
    if (name === 'color') return ['black', 'red', 'blue'];

    const data: Key[] = [];

    if (!this.allProducts) {
      await this.getAllProducts();
    }
    if (this.allProducts) {
      this.allProducts.forEach((product) => {
        const productAttributes = product.masterVariant.attributes;
        if (productAttributes) {
          productAttributes.forEach((attribute) => {
            if (attribute.name === name) {
              addUnique(data, attribute.value);
            }
          });
        }
        if (name === 'price') {
          const priceData = product.masterVariant.prices?.[0];
          if (priceData) {
            const price = priceData.discounted ? priceData.discounted.value.centAmount : priceData.value.centAmount;
            addUnique(data, price as Key);
          }
        }
      });
    }
    return data;
  }

  getFilterInputsData = () => {
    const data: { [key: string]: { [key: string]: string } } = {};

    this.selectInputs.forEach((select) => {
      data[select.name] = select.getData();
      data[select.name].type = 'text';
    });

    this.rangeInputs.forEach((range) => {
      data[range.name] = range.getData();
      data[range.name].type = 'number';
    });

    return data;
  };

  clear() {
    this.allProducts = null;
    this.initialCategoryFilter = this.list.currentFilter;

    this.selectInputs = [];
    this.rangeInputs = [];

    this.filtersContainer.removeChildren();
    this.selectedFiltersContainer.removeChildren();
    this.searchInput.input.value = '';
    this.sortSelect.element.value = 'id asc';
  }

  createSortSelect() {
    const sortSelect = new SortFilter();
    sortSelect.addListener('change', this.updateProducts);
    return sortSelect;
  }

  createSearchInput() {
    const searchInput = new SearchFilter();
    searchInput.addListeners(this.updateProducts);
    return searchInput;
  }
}
