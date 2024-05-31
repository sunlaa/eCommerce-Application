import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import InputField from '@/utils/elements/input_field';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class SelectFilter extends BaseElement {
  label: string;
  name: string;
  data: string[];

  optionsForm = new Form({ classes: [CLASS_NAMES.catalog.selectForm] });

  isClosed: boolean = true;

  checkboxes: Input[] = [];

  constructor(label: string, name: string, data: string[]) {
    super(
      {
        classes: [CLASS_NAMES.catalog.selectFilterContainer],
      },
      new Paragraph(label, [CLASS_NAMES.catalog.filterTitle])
    );

    this.name = name;
    this.label = label;
    this.data = data;

    this.createCheckboxes();
  }
  getData = () => {
    return this.optionsForm.getData();
  };

  createCheckboxes() {
    this.data.forEach((text) => {
      const checkbox = new InputField([CLASS_NAMES.catalog.selectCheckbox], {
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
