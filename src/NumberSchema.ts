import * as _ from 'lodash';
import { Schema } from './Schema';

const numberMessages = {
  type: 'must be a number',
  integer: 'must be a whole number',
  decimalPlaces: (a: number, b?: number) =>
    b == null
      ? `must have at most ${a} decimal places`
      : a === b
      ? `must have ${a} decimal places`
      : `must have between ${a} and ${b} decimal places`,
};

/**
 * Requires the value to be a number, or a string representing a number.
 */
export class NumberSchema extends Schema<
  number | undefined | null,
  typeof numberMessages
> {
  constructor() {
    super(
      numberMessages,
      value =>
        value == null ||
        value === '' ||
        _.isNumber(value) ||
        (_.isString(value) && /^[+\-]?([0-9]*\.[0-9]+|[0-9]+)$/.test(value)),
    );
  }

  /**
   * Requries the number not to have any decimal places.
   */
  integer(): this {
    return this.addTest(
      value =>
        value == null ||
        value === '' ||
        _.isInteger(_.isNumber(value) ? value : parseFloat(value)),
      'must be a whole number',
    );
  }

  /**
   * Requires the number to have no more than the specified number of decimal places.
   * @param max the maximum number of decimal places allowed
   */
  decimalPlaces(max: number): this;
  /**
   * Requires the number to have a number of decimal places within the specified range.
   * @param min the minimum number of decimal places allowed
   * @param max the maximum number of decimal places allowed
   */
  decimalPlaces(min: number, max: number): this;
  decimalPlaces(a: number, b?: number): this {
    let message: string;
    let regex: RegExp;

    if (typeof b === 'undefined') {
      message = this._messages.decimalPlaces(a);
      regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${a}})?$`);
    } else {
      message = this._messages.decimalPlaces(a, b);
      regex = new RegExp(`^[0-9]+\\.[0-9]{${a},${b}}$`);
    }

    return this.addTest(
      value => value == null || value === '' || regex.test(value.toString()),
      message,
    );
  }

  cast(value: any): number {
    if (value == null) {
      return value;
    }
    return parseFloat(value);
  }
}

export const number = new NumberSchema();
