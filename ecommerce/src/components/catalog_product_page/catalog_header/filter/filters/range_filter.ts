import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import { AttributeDefinition } from '@commercetools/platform-sdk';

export default class RangeFilter extends BaseElement {
  rangeForm: Form = new Form({ styles: { display: 'flex', gap: '1em' } });

  name: string;
  from: number;
  to: number;

  minInput: Input = new Input({});
  maxInput: Input = new Input({});

  constructor(attribute: AttributeDefinition, { from, to }: { from: number; to: number }) {
    super({ content: attribute.label.en });

    this.name = attribute.name;
    this.from = from;
    this.to = to;

    this.createInputs();
  }

  getData = () => {
    const data = this.rangeForm.getData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === '') data[key] = '0';
    });
    return data;
  };

  createInputs() {
    this.minInput = new Input({
      type: 'text',
      name: 'min',
      value: `${this.from}`,
      placeholder: `${this.from}`,
    });
    this.maxInput = new Input({
      type: 'text',
      name: 'max',
      value: `${this.to}`,
      placeholder: `${this.to}`,
    });
    [this.minInput, this.maxInput].forEach((elem) => {
      elem.addListener('input', () => {
        const value = elem.value;
        if (!/^\d*$/.test(value)) {
          elem.value = value.replace(/\D/g, '');
        }

        this.getData();
      });
    });

    const separator = new BaseElement({ content: '—' });

    this.rangeForm.appendChildren(this.minInput, separator, this.maxInput);
    this.append(this.rangeForm);
  }

  addInputHandler(callback: () => void) {
    [this.minInput, this.maxInput].forEach((elem) => {
      elem.addListener('input', callback);
    });
  }
}
