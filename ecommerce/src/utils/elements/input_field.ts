import { ParamsOmitTag } from '../types_variables/types';
import BaseElement from './basic_element';
import ErrorContainer from './error_container';
import Input from './input';
import Label from './label';

type InnerProps = {
  label?: ParamsOmitTag<HTMLLabelElement>;
  input: ParamsOmitTag<HTMLInputElement>;
  error?: { classes: string[] };
};

export default class InputField extends BaseElement {
  label: Label | null = null;

  input: Input;

  errorContainer: ErrorContainer | null = null;

  constructor(classes: string[], inner: InnerProps) {
    super({ classes });

    if (inner.label) {
      this.label = new Label({ htmlFor: inner.input.id, ...inner.label });
      this.append(this.label);
    }

    this.input = new Input({ id: inner.input.name, ...inner.input });

    this.append(this.input);

    if (inner.error) {
      this.errorContainer = new ErrorContainer(inner.error.classes);
      this.append(this.errorContainer);
    }
  }

  showErrorMessage = (text: string) => {
    if (this.errorContainer === null) throw new Error('No container for error message');

    this.errorContainer.showMessage(text);
  };

  hideErrorMessage = () => {
    if (this.errorContainer === null) throw new Error('No container for error message');

    this.errorContainer.hideMessage();
  };

  togglePasswordVisibility() {
    if (this.input.getElement().type === 'password') {
      this.input.getElement().type = 'text';
    } else {
      this.input.getElement().type = 'password';
    }
  }
}
