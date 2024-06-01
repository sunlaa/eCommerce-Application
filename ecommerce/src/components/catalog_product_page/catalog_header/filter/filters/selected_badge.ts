import BaseElement from '@/utils/elements/basic_element';
import InputField from '@/utils/elements/input_field';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class SelectedBadge extends BaseElement {
  inputFiled: InputField;

  constructor(inputFiled: InputField) {
    super({ tag: 'p', content: inputFiled.label?.content, classes: [CLASS_NAMES.catalog.selectedBadge] });
    this.inputFiled = inputFiled;

    const cross = new BaseElement({ tag: 'span', classes: [CLASS_NAMES.catalog.badgeCross] });
    cross.addListener('click', this.unchecked);
    this.append(cross);
  }

  unchecked = () => {
    this.inputFiled.input.element.checked = false;
    this.inputFiled.input.element.dispatchEvent(new Event('input'));
    this.remove();
  };
}
