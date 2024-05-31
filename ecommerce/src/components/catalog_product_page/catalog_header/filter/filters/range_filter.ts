import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import Paragraph from '@/utils/elements/paragraph';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class RangeFilter extends BaseElement {
  label: string;
  name: string;
  from: number;
  to: number;

  sliderTrack = new Form({ classes: [CLASS_NAMES.catalog.rangeSlider] });

  minInput: Input;
  maxInput: Input;

  minValue: Paragraph;
  maxValue: Paragraph;
  currentMax: number;
  currentMin: number;

  inputValue: string;

  constructor(label: string, name: string, { from, to }: { from: number; to: number }, inputValue: string = '') {
    super(
      { classes: [CLASS_NAMES.catalog.rangeFilterContainer] },
      new Paragraph(`${label}:`, [CLASS_NAMES.catalog.filterTitle])
    );

    this.label = label;
    this.name = name;
    this.from = from;
    this.to = to;

    this.inputValue = inputValue;

    this.currentMin = from;
    this.currentMax = to;

    this.minInput = new Input({
      type: 'range',
      name: 'min',
      min: `${this.from}`,
      max: `${this.to}`,
      value: `${this.from}`,
    });
    this.maxInput = new Input({
      type: 'range',
      name: 'max',
      min: `${this.from}`,
      max: `${this.to}`,
      value: `${this.to}`,
    });

    this.minValue = new Paragraph('');
    this.maxValue = new Paragraph('');
    this.sliderTrack.appendChildren(this.minInput, this.maxInput);

    this.appendChildren(
      new BaseElement({ classes: [CLASS_NAMES.catalog.sliderContainer] }, this.sliderTrack),
      new BaseElement({ classes: [CLASS_NAMES.catalog.rangeValueContainer] }, this.minValue, this.maxValue)
    );

    [this.minInput, this.maxInput].forEach((input) => {
      input.addListener('input', () => {
        this.normalize();
      });
    });

    this.setCorrectValues();
    this.paint();
  }

  normalize = () => {
    if (+this.minInput.value >= +this.maxInput.value) {
      this.minInput.value = this.maxInput.value;
    }
    if (+this.maxInput.value <= +this.minInput.value) {
      this.maxInput.value = this.minInput.value;
    }

    this.setCorrectValues();
    this.paint();
  };

  setCorrectValues() {
    if (this.name === 'price') {
      this.minValue.content = `${this.minInput.value} ${this.inputValue}`;
      this.maxValue.content = `${this.maxInput.value} ${this.inputValue}`;
    } else {
      this.minValue.content = this.minInput.value;
      this.maxValue.content = this.maxInput.value;
    }
  }

  paint() {
    const { to, from, minInput, maxInput, sliderTrack } = this;
    const allParts = to - from;
    const calculatePercent = (value: string) => 100 - Math.floor(((to - +value) / allParts) * 100);

    const percent1 = calculatePercent(minInput.value);
    const percent2 = calculatePercent(maxInput.value);

    sliderTrack.setStyles({
      background: `linear-gradient(to right, #ededed ${percent1}%, black ${percent1}%, black ${percent2}%, #ededed ${percent2}%)`,
    });
  }

  getData = () => {
    const data = this.sliderTrack.getData();
    if (this.name === 'price') {
      return { min: `${Math.floor(+data.min * 100)}`, max: `${Math.floor(+data.max * 100)}` };
    }
    return data;
  };

  addInputHandler(callback: () => void) {
    [this.minInput, this.maxInput].forEach((elem) => {
      elem.addListener('mouseup', () => {
        if (this.currentMin === +this.minInput.value && this.currentMax === +this.maxInput.value) return;

        this.currentMin = +this.minInput.value;
        this.currentMax = +this.maxInput.value;
        callback();
      });
    });
  }
}
