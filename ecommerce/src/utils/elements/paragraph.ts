import BaseElement from './basic_element';

export default class Paragraph extends BaseElement<HTMLParagraphElement> {
  constructor(classes: string[], content: string) {
    super({ tag: 'p', classes, content });
  }
}
