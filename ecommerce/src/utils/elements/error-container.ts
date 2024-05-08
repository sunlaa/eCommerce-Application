import Paragraph from './paragraph';

export default class ErrorContainer extends Paragraph {
  constructor(classes: string[], content: string) {
    super(classes, content);
  }

  setMessage(text: string) {
    this.content = text;
  }

  clearMessage() {
    this.content = '';
  }
}
