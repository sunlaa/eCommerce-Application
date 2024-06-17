import BaseElement from './basic_element';

export default class Paragraph extends BaseElement<HTMLParagraphElement> {
  constructor(content: string, classes: string[] = []) {
    super({ tag: 'p', classes, content });
  }
}
