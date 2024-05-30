import './filter.sass';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';
import CatalogList from '../../catalog_list/list';
import SelectFilter from './filters/select_filter';
import RangeFilter from './filters/range_filter';
import BaseElement from '@/utils/elements/basic_element';
import { getAttributeFilter } from '@/utils/functions/get_filters';

export default class Filter extends BaseElement {
  inputsFilterContainer = new BaseElement({ classes: [CLASS_NAMES.catalog.inputsFilterContainer] });

  currentTypeId: string = '';
  list: CatalogList;
  initialFilter: string[];

  rangeInputs: RangeFilter[] = [];
  selectInputs: SelectFilter[] = [];

  constructor(list: CatalogList) {
    super({ classes: [CLASS_NAMES.catalog.filter] });

    this.initialFilter = list.currentFilter;
    this.list = list;

    this.append(this.inputsFilterContainer);
  }

  async changeFilters(typeID: string) {
    this.currentTypeId = typeID;
    const productType = await sdk.getProductTypeById(typeID);

    if (!productType || !productType.attributes) return;

    this.inputsFilterContainer.removeChildren();
    this.selectInputs = [];
    this.rangeInputs = [];

    for await (const attribute of productType.attributes) {
      if (TEXT_CONTENT.unFilteredAttributes.includes(attribute.name)) continue;

      const data = await this.getAttributesData(attribute.name);

      if (attribute.type.name === 'text') {
        const select = new SelectFilter(attribute, data as string[]);

        select.addInputHandler(this.updateProducts);

        this.selectInputs.push(select);
        this.inputsFilterContainer.append(select);
      } else if (attribute.type.name === 'number') {
        const minmax = this.getMinMax(data as number[]);
        const range = new RangeFilter(attribute, minmax);

        range.addInputHandler(this.updateProducts);

        this.rangeInputs.push(range);

        this.inputsFilterContainer.append(range);
      }
    }
  }

  updateProducts = () => {
    this.list.redraw(this.getQueryArray()).catch((err) => console.log(err));
  };

  async getAttributesData<Key>(name: string) {
    const data: Key[] = [];

    if (name === 'color') return ['black', 'red', 'blue'];

    this.initialFilter = this.list.currentFilter;

    const response = await sdk.getProductWithFilters(this.list.currentFilter, undefined, 0);
    const { total } = response;

    const allProducts = await sdk.getProductWithFilters(this.list.currentFilter, undefined, total);
    allProducts.results.forEach((product) => {
      const productAttributes = product.masterVariant.attributes;
      if (productAttributes) {
        productAttributes.forEach((attribute) => {
          if (attribute.name === name) {
            this.addUnique(data, attribute.value);
          }
        });
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
        result.push(attrQuery);
      } else if (data[attributeName].type === 'number') {
        result.push(
          `variants.attributes.${attributeName}:range (${data[attributeName].min} to ${data[attributeName].max})`
        );
      }
    });
    return result;
  }

  clear() {
    this.inputsFilterContainer.removeChildren();
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
