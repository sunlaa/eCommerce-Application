import { ParamsOmitTag, RequiredParamsForInput } from '../types_variables/types';
import BaseElement from './basic_element';
import ErrorContainer from './error_container';
import Input from './input';
import Label from './label';

type InnerProps = {
  label: ParamsOmitTag;
  input: RequiredParamsForInput;
  error?: { classes: string[] };
};

export default class InputField extends BaseElement {
  errorContainer: ErrorContainer | null = null;

  constructor(classes: string[], inner: InnerProps) {
    super({ classes }, new Label({ htmlFor: inner.input.name, ...inner.label }), new Input(inner.input));

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
}
