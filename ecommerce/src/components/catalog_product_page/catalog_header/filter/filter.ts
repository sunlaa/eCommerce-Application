import './filter.sass';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import CatalogList from '../../catalog_list/list';
import SelectFilter from './filters/select_filter';
import BaseElement from '@/utils/elements/basic_element';
import { getAttributeFilter } from '@/utils/functions/get_filters';
import RangeFilter from './filters/range_filter';
import { fixPrice } from '@/utils/functions/fix_price';
import { getMaxPrice } from '@/utils/functions/get_max_price';

export default class Filter extends BaseElement {
  filtersContainer: BaseElement;
  rangeContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.rangeFilters] });
  selectContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.selectFilters] });

  selectedFilters = new BaseElement({ classes: [CLASS_NAMES.catalog.selectedContainer] });

  currentTypeId: string = '';
  list: CatalogList;
  initialFilter: string[];

  rangeInputs: RangeFilter[] = [];
  selectInputs: SelectFilter[] = [];

  constructor(list: CatalogList) {
    super({ classes: [CLASS_NAMES.catalog.filter] });

    this.initialFilter = list.currentFilter;
    this.list = list;

    this.filtersContainer = new BaseElement(
      { classes: [CLASS_NAMES.catalog.filtersContainer] },
      this.rangeContainer,
      this.selectContainer
    );

    this.appendChildren(this.filtersContainer, this.selectedFilters);
  }

  updateProducts = () => {
    const query = this.getQueryArray();
    this.list.redraw(query).catch((err) => console.log(err));
  };

  async changeFilters(typeID: string) {
    this.currentTypeId = typeID;
    const productType = await sdk.getProductTypeById(typeID);

    if (!productType || !productType.attributes) return;

    this.clear();
    this.selectInputs = [];
    this.rangeInputs = [];

    for await (const attribute of productType.attributes) {
      if (TEXT_CONTENT.unFilteredAttributes.includes(attribute.name)) continue;

      const data = await this.getAttributesData(attribute.name);

      if (attribute.type.name === 'text') {
        const select = new SelectFilter(attribute.label.en, attribute.name, data as string[], this.selectedFilters);

        select.addInputHandler(this.updateProducts);

        this.selectInputs.push(select);
        this.selectContainer.append(select);
        this.filtersContainer.append(this.selectContainer);
      } else if (attribute.type.name === 'number') {
        const minmax = this.getMinMax(data as number[]);
        const range = new RangeFilter(attribute.label.en, attribute.name, minmax);

        range.addInputHandler(this.updateProducts);

        this.rangeInputs.push(range);
        this.rangeContainer.append(range);
        this.filtersContainer.append(this.rangeContainer);
      }
    }

    await this.addPriceFilter();
  }

  async addPriceFilter() {
    const data = await this.getAttributesData('price');

    const minmax = this.getMinMax(data as number[]);
    const range = new RangeFilter('Price', 'price', minmax, '€');

    range.addInputHandler(this.updateProducts);

    this.rangeInputs.push(range);
    this.rangeContainer.append(range);
  }

  async getAttributesData<Key>(name: string) {
    const data: Key[] = [];

    if (name === 'color') return ['black', 'red', 'blue'];

    this.initialFilter = this.list.currentFilter;

    const response = await sdk.getProductWithFilters(this.list.currentFilter, undefined, 0);
    if (!response) return;
    const { total } = response;

    const allProducts = await sdk.getProductWithFilters(this.list.currentFilter, undefined, total);
    if (!allProducts) return;
    allProducts.results.forEach((product) => {
      const productAttributes = product.masterVariant.attributes;
      if (productAttributes) {
        productAttributes.forEach((attribute) => {
          if (attribute.name === name) {
            this.addUnique(data, attribute.value);
          }
        });
      }
      if (name === 'price') {
        const maxPriceVariant = getMaxPrice(product);
        const priceData = maxPriceVariant.prices?.[0];
        if (priceData) {
          const price = priceData.discounted
            ? fixPrice(priceData.discounted.value.centAmount, priceData.discounted.value.fractionDigits)
            : fixPrice(priceData.value.centAmount, priceData.value.fractionDigits);
          this.addUnique(data, price as Key);
        }
      }
    });

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
    this.rangeContainer.removeChildren();
    this.selectContainer.removeChildren();
    this.selectedFilters.removeChildren();
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
