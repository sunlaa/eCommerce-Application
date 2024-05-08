import Paragraph from './paragraph';

export default class ErrorContainer extends Paragraph {
  constructor(content: string, classes: string[]) {
    super(content, classes);
  }

  setMessage(text: string) {
    this.content = text;
  }

  clearMessage() {
    this.content = '';
  }
}
