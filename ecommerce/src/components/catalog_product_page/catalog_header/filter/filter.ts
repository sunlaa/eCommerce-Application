import './filter.sass';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import CatalogList from '../../catalog_list/list';
import SelectFilter from './filters/select_filter';
import BaseElement from '@/utils/elements/basic_element';
import { getAttributeFilter } from '@/utils/functions/get_filters';
import RangeFilter from './filters/range_filter';
import { fixPrice } from '@/utils/functions/fix_price';
import InputField from '@/utils/elements/input_field';
import { ProductProjection } from '@commercetools/platform-sdk';

export default class Filter extends BaseElement {
  filtersContainer: BaseElement;

  searchSortContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.searchSortContainer] });

  selectedFiltersContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.selectedContainer] });

  currentTypeId: string = '';
  allProducts: ProductProjection[] | null = null;

  list: CatalogList;
  initialFilter: string[];
  sortSelect: BaseElement<HTMLSelectElement> | null = null;
  searchInput: InputField | null = null;

  rangeInputs: RangeFilter[] = [];
  selectInputs: SelectFilter[] = [];

  constructor(list: CatalogList) {
    super({ classes: [CLASS_NAMES.catalog.filter] });

    this.initialFilter = list.currentFilter;
    this.list = list;

    this.filtersContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.filtersContainer] });

    this.appendChildren(this.filtersContainer, this.selectedFiltersContainer, this.searchSortContainer);
    this.addSortInput();
    this.addSearchInput();
  }

  updateProducts = () => {
    const query = this.getQueryArray();
    const sort = this.sortSelect?.element.value;
    const search = this.searchInput?.input.value;
    this.list.redraw(query, sort, search).catch((err) => console.log(err));
  };

  async changeFilters(typeID: string) {
    this.currentTypeId = typeID;
    const productType = await sdk.getProductTypeById(typeID);

    if (!productType || !productType.attributes) return;

    this.clear();
    this.selectInputs = [];
    this.rangeInputs = [];

    await this.addPriceFilter();

    for await (const attribute of productType.attributes) {
      if (TEXT_CONTENT.unFilteredAttributes.includes(attribute.name)) continue;

      const data = await this.getAttributesData(attribute.name);

      if (attribute.type.name === 'text') {
        const select = new SelectFilter(
          attribute.label.en,
          attribute.name,
          data as string[],
          this.selectedFiltersContainer
        );

        select.addInputHandler(this.updateProducts);

        this.selectInputs.push(select);
        this.filtersContainer.append(select);
      } else if (attribute.type.name === 'number') {
        const minmax = this.getMinMax(data as number[]);
        const range = new RangeFilter(attribute.label.en, attribute.name, minmax);

        range.addInputHandler(this.updateProducts);

        this.rangeInputs.push(range);
        this.filtersContainer.append(range);
      }
    }

    this.updateProducts();
  }

  async addPriceFilter() {
    const data = await this.getAttributesData('price');

    const minmax = this.getMinMax(data as number[]);
    const range = new RangeFilter('Variants price', 'price', minmax, '€');

    range.addInputHandler(this.updateProducts);

    this.rangeInputs.push(range);
    this.filtersContainer.append(range);
  }

  addSortInput() {
    this.sortSelect = new BaseElement({ tag: 'select', classes: [CLASS_NAMES.catalog.sortSelect] });
    const options: BaseElement<HTMLOptionElement>[] = [];
    const optionsValue = ['price asc', 'price desc', 'name.en asc', 'name.en desc'];

    TEXT_CONTENT.sortOptionsContent.forEach((sortText, i) => {
      options.push(
        new BaseElement<HTMLOptionElement>({
          tag: 'option',
          content: sortText,
          value: optionsValue[i],
        })
      );
    });
    this.sortSelect.appendChildren(...options);
    this.sortSelect.addListener('change', this.updateProducts);

    this.searchSortContainer.append(this.sortSelect);
  }

  addSearchInput() {
    this.searchInput = new InputField([CLASS_NAMES.catalog.searchInput], {
      label: { content: 'Search' },
      input: { type: 'text', name: 'search' },
    });

    const lupa = new BaseElement({
      classes: ['lupa'],
      styles: { backgroundColor: 'red', width: '20px', height: '20px' },
    });

    this.searchInput.append(lupa);

    lupa.addListener('click', this.updateProducts);

    this.searchSortContainer.append(this.searchInput);
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

  async getAttributesData<Key>(name: string) {
    if (name === 'color') return ['black', 'red', 'blue'];

    const data: Key[] = [];
    this.initialFilter = this.list.currentFilter;

    if (!this.allProducts) {
      await this.getAllProducts();
    }
    if (this.allProducts) {
      this.allProducts.forEach((product) => {
        const productAttributes = product.masterVariant.attributes;
        if (productAttributes) {
          productAttributes.forEach((attribute) => {
            if (attribute.name === name) {
              this.addUnique(data, attribute.value);
            }
          });
        }
        if (name === 'price') {
          const priceData = product.masterVariant.prices?.[0];
          if (priceData) {
            const price = priceData.discounted
              ? fixPrice(priceData.discounted.value.centAmount, priceData.discounted.value.fractionDigits)
              : fixPrice(priceData.value.centAmount, priceData.value.fractionDigits);
            this.addUnique(data, price as Key);
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

  getQueryArray() {
    const data = this.getFilterInputsData();
    const result = [...this.initialFilter];

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

  clear() {
    this.allProducts = null;
    this.filtersContainer.removeChildren();
    this.selectedFiltersContainer.removeChildren();
  }

  addUnique<Key>(arr: Key[], value: Key) {
    if (arr.includes(value)) return;
    arr.push(value);
  }

  getMinMax(arr: number[]) {
    let from = Infinity;
    let to = -Infinity;

    arr.forEach((num) => {
      from = Math.min(num, from);
      to = Math.max(num, to);
    });

    return { from, to };
  }
}
