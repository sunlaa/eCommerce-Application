import nonNullable from '../functions/non_nullable';
import { Params } from '../types_variables/types';

export default class BaseElement<T extends HTMLElement = HTMLElement> {
  element: T;

  constructor(params: Params<T>, ...childs: (BaseElement | HTMLElement | null)[]) {
    let { tag } = params;
    if (!tag) tag = 'div';

    const element = document.createElement(tag) as T;

    if (params.styles) Object.assign(element.style, params.styles);
    if (params.content) element.textContent = params.content;
    Object.assign(element, params);
    this.element = element;

    if (params.classes) {
      params.classes.forEach((name) => this.element.classList.add(name));
    }

    if (childs) {
      this.appendChildren(...childs);
    }
  }

  get content(): string {
    return this.element.textContent || '';
  }

  set content(text: string) {
    this.element.textContent = text;
  }

  addClass(className: string) {
    this.element.classList.add(className);
  }

  removeClass(className: string) {
    this.element.classList.remove(className);
  }

  classList() {
    return this.element.classList;
  }

  containClass(className: string): boolean {
    if (this.element.classList.contains(className)) {
      return true;
    }
    return false;
  }

  getElement() {
    return this.element;
  }

  append(child: BaseElement | HTMLElement) {
    if (child instanceof BaseElement) {
      const elem = child.getElement();
      this.element.append(elem);
    } else {
      this.element.append(child);
    }
  }

  prepend(child: BaseElement | HTMLElement) {
    if (child instanceof BaseElement) {
      const elem = child.getElement();
      this.element.prepend(elem);
    } else {
      this.element.prepend(child);
    }
  }

  appendChildren(...children: (BaseElement | HTMLElement | null)[]): void {
    children.filter(nonNullable).forEach((elem) => {
      this.append(elem);
    });
  }

  getChildren(): HTMLElement[] {
    const { children } = this.element;
    const childElements: HTMLElement[] = [];
    for (let i = 0; i < children.length; i += 1) {
      if (children[i] instanceof HTMLElement) {
        childElements.push(children[i] as HTMLElement);
      }
    }
    return childElements;
  }

  removeChildren() {
    const children = this.getChildren();
    children.forEach((child) => {
      child.remove();
    });
  }

  remove() {
    this.element.remove();
  }

  addListener(event: string, callback: (e: Event) => void) {
    this.element.addEventListener(event, callback);
  }

  removeListener(event: string, callback: (e: Event) => void) {
    this.element.removeEventListener(event, callback);
  }

  getAttribute(attribute: string) {
    return this.element.getAttribute(attribute);
  }

  setAttribute(attribute: string, value: string) {
    this.element.setAttribute(attribute, value);
  }

  removeAttribute(atribute: string) {
    this.element.removeAttribute(atribute);
  }

  setStyles(styles: Partial<CSSStyleDeclaration>) {
    Object.assign(this.element.style, styles);
  }
}
