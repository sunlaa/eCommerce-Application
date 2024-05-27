import Anchor from '@/utils/elements/anchor';
import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Breadcrumb extends BaseElement {
  currentPath: Anchor[] = [];

  constructor() {
    super({ tag: 'p', classes: [CLASS_NAMES.catalog.breadcrumb] });
  }

  render() {
    this.element.innerHTML = '';
    this.currentPath.forEach((link, i) => {
      const separator = new BaseElement({
        // tag: 'span',
        classes: [CLASS_NAMES.catalog.separator],
        content: ' / ',
        styles: { color: this.generateBrightColor() },
      });
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
      classes: [CLASS_NAMES.catalog.breadcrumbLink],
    });

    return link;
  };

  generateBrightColor = () => {
    const brightColors = [
      '#ff0066',
      '#4400ff',
      '#00ff99',
      '#ff6600',
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ff00ff',
      '#00ffff',
      '#ffff00',
    ];
    const randomIndex = Math.floor(Math.random() * brightColors.length);
    return brightColors[randomIndex];
  };
}
