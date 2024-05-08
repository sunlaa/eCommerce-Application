import Paragraph from './paragraph';

export default class ErrorContainer extends Paragraph {
  constructor(classes: string[]) {
    super('', classes);
  }

  setMessage(text: string) {
    this.content = text;
  }

  clearMessage() {
    this.content = '';
  }
}
