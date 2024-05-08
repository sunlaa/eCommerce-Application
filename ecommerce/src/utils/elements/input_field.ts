import { RequiredParamsForInput, RequiredParamsForLabel } from '../types/types';
import BaseElement from './basic_element';
import ErrorContainer from './error-container';
import Input from './input';
import Label from './label';

const delay = 200;

type InnerProps = {
  input: RequiredParamsForInput;
  label: RequiredParamsForLabel;
  error?: { classes: string[]; content: string };
};

export default class InputField extends BaseElement {
  errorContainer: ErrorContainer | null = null;

  constructor(inner: InnerProps, classes: string[]) {
    super({ classes }, new Input(inner.input), new Label(inner.label));

    if (inner.error) {
      this.errorContainer = new ErrorContainer(inner.error.content, inner.error.classes);
      this.append(this.errorContainer);
    }
  }

  showErrorMessage = (text: string) => {
    if (this.errorContainer === null) throw new Error('No container for error message');

    // The error container must have the property "transition" with delay from the corresponding variable above
    this.errorContainer.setStyles({ opacity: '0' });

    setTimeout(() => {
      if (this.errorContainer) {
        this.errorContainer.setMessage(text);
        this.errorContainer.setStyles({ opacity: '1' });
      }
    }, delay);
  };

  hideErrorMessage = () => {
    if (this.errorContainer === null) throw new Error('No container for error message');

    // The error container must have the property "transition" with delay from the corresponding variable above
    this.errorContainer.setStyles({ opacity: '0' });

    setTimeout(() => {
      if (this.errorContainer) {
        this.errorContainer.clearMessage();
      }
    }, delay);
  };
}
