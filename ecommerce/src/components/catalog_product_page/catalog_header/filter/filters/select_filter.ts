import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import InputField from '@/utils/elements/input_field';
import { AttributeDefinition } from '@commercetools/platform-sdk';

export default class SelectFilter extends BaseElement {
  name: string;

  data: string[];

  optionsContainer = new BaseElement({});
  optionsForm = new Form({});

  isClosed: boolean = true;

  checkboxes: Input[] = [];

  constructor(attribute: AttributeDefinition, data: string[]) {
    super({ content: attribute.label.en, styles: { position: 'relative' } });

    this.name = attribute.name;
    this.data = data;

    this.createCheckboxes();
  }
  getData = () => {
    const data = this.optionsForm.getData();
    return data;
  };

  createCheckboxes() {
    this.optionsContainer.append(this.optionsForm);
    this.data.forEach((text) => {
      const checkbox = new InputField([], {
        label: { content: text },
        input: { type: 'checkbox', name: text },
      });
      checkbox.addListener('input', () => {
        this.getData();
      });

      this.checkboxes.push(checkbox.input);
      this.optionsForm.append(checkbox);
      this.append(this.optionsForm);
    });
  }

  addInputHandler(callback: () => void) {
    this.checkboxes.forEach((elem) => {
      elem.addListener('input', callback);
    });
  }
}
