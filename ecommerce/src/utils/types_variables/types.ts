export type Params<T extends HTMLElement = HTMLElement> = Partial<Omit<T, 'tagName' | 'className'>> & {
  tag?: keyof HTMLElementTagNameMap;
  content?: string;
  classes?: string[];
  styles?: Partial<CSSStyleDeclaration>;
};

export type ParamsOmitTag<T extends HTMLElement = HTMLElement> = Omit<Params<T>, 'tag'>;

export type RequiredParamsForInput = Required<Pick<HTMLInputElement, 'name' | 'type'>> &
  ParamsOmitTag<HTMLInputElement>;

export type RequiredParamsForAnchor = Required<Pick<HTMLAnchorElement, 'href'>> & ParamsOmitTag<HTMLAnchorElement>;

export type AllFormInputs = (HTMLInputElement | HTMLSelectElement)[];
