import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Breadcrumb extends BaseElement {
  currentPath: Anchor[] = [];

  separator = new BaseElement({ tag: 'span', content: ' / ' });

  constructor() {
    super({ tag: 'p', classes: [CLASS_NAMES.catalog.breadcrumb] });
  }

  render() {
    this.element.innerHTML = '';
    this.currentPath.forEach((link, i) => {
      const separator = this.separator.element.cloneNode(true) as HTMLElement;
      if (i === 0) {
        this.append(link);
      } else {
        this.appendChildren(separator, link);
      }
    });
  }

  addLink(name: string, key: string) {
    const link = this.createLink(name, key);
    this.currentPath.push(link);
    this.render();
  }

  removeAfter = (name: string) => {
    const index = this.currentPath.findIndex((path) => path.content === name);
    if (index !== -1) {
      this.currentPath.splice(index + 1);
      this.render();
    }
  };

  createLink = (name: string, key: string) => {
    let href = `/catalog/${key}`;
    if (key === '') href = '/catalog';

    const link = new Anchor({
      href,
      styles: { display: 'inline' },
      content: name,
    });

    return link;
  };
}
