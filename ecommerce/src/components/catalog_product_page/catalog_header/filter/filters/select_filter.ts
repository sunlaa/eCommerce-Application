import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import InputField from '@/utils/elements/input_field';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
import SelectedBadge from './selected_badge';

export default class SelectFilter extends BaseElement {
  label: string;
  name: string;
  data: string[];

  optionsForm = new Form({ classes: [CLASS_NAMES.catalog.selectForm] });

  isClosed: boolean = true;

  checkboxes: Input[] = [];
  selectedContainer: BaseElement;

  constructor(label: string, name: string, data: string[], selectedContainer: BaseElement) {
    super({
      classes: [CLASS_NAMES.catalog.selectFilterContainer],
    });

    this.name = name;
    this.label = label;
    this.data = data;

    this.selectedContainer = selectedContainer;

    const titleParagraph = new BaseElement(
      { tag: 'p', content: label, classes: [CLASS_NAMES.catalog.filterTitle] },
      new BaseElement({ tag: 'span', classes: [CLASS_NAMES.catalog.selsectArrow] })
    );
    titleParagraph.addListener('click', this.toogle);
    this.append(titleParagraph);

    window.addEventListener('click', this.closeIfOut);

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

      const badge = new SelectedBadge(checkbox);

      checkbox.addListener('input', () => {
        if (checkbox.input.element.checked) {
          this.selectedContainer.append(badge);
        } else {
          badge.remove();
        }
      });

      this.checkboxes.push(checkbox.input);
      this.optionsForm.append(checkbox);
    });
  }

  addInputHandler(callback: () => void) {
    this.checkboxes.forEach((elem) => {
      elem.addListener('input', callback);
    });
  }

  toogle = () => {
    if (this.isClosed) {
      this.append(this.optionsForm);
      this.isClosed = false;
    } else {
      this.optionsForm.remove();
      this.isClosed = true;
    }
  };

  closeIfOut = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!this.element.contains(target)) {
      this.optionsForm.remove();
      this.isClosed = true;
    }
  };
}
