import * as _ from 'lodash';
import { Schema } from './Schema';

const stringMessages = {
  type: 'must be a string',
  regex: (regex: RegExp) => 'must match regex ' + regex,
  email: 'must be an email address',
  min: (length: number) => `must be at least ${length} characters`,
  max: (length: number) => `must be at most ${length} characters`,
};

/**
 * Requires the value to be a string.
 */
export class StringSchema extends Schema<
  string | undefined | null,
  typeof stringMessages
> {
  constructor() {
    super(
      stringMessages,
      value =>
        value == null ||
        _.isString(value) ||
        (typeof value.toString === 'function' && _.isString(value.toString())),
    );
  }

  /**
   * Requires the value to match the specified regex.
   * @param regex the regex to match
   * @param message the message to return if the value does not match
   */
  regex(regex: RegExp, message?: string): this {
    return this.addTest(
      value => value == null || value === '' || regex.test(value),
      message || this._messages.regex(regex),
    );
  }

  /**
   * Requires the value to be an email address.
   */
  email(): this {
    return this.regex(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      this._messages.email,
    );
  }

  /**
   * Requires the value to be at least the specified number of characters long.
   * @param length the minimum number of characters to allow
   */
  min(length: number): this {
    return this.addTest(
      value => value == null || value.length >= length,
      this._messages.min(length),
    );
  }

  /**
   * Requires the value to be at most the specfied number of characters long.
   * @param length the maximum number of characters to allow
   */
  max(length: number): this {
    return this.addTest(
      value => value == null || value.length <= length,
      this._messages.max(length),
    );
  }

  cast(value: any): string {
    return typeof value === 'string' || value == null
      ? value
      : value.toString();
  }
}

export const string = new StringSchema();
