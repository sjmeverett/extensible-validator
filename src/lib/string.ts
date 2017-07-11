import * as _ from 'lodash';
import { Any } from './any';

/**
 * Requires the value to be a string.
 */
export class String extends Any {
  constructor() {
    super(
      (value) => value == null || _.isString(value),
      'must be a string'
    );
  }

  /**
   * Requires the value to match the specified regex.
   * @param regex the regex to match
   * @param message the message to return if the value does not match
   */
  regex(regex: RegExp, message?: string): this {
    return this.addTest(
      (value) => value == null || value === '' || regex.test(value),
      message || ('must match regex ' + regex)
    );
  }

  /**
   * Requires the value to be an email address.
   */
  email(): this {
    return this.regex(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'must be an email address');
  }

  /**
   * Requires the value to be at least the specified number of characters long.
   * @param length the minimum number of characters to allow
   */
  min(length: number): this {
    return this.addTest(
      (value) => value == null || value.length >= length,
      `must be at least ${length} characters`
    );
  }

  /**
   * Requires the value to be at most the specfied number of characters long.
   * @param length the maximum number of characters to allow
   */
  max(length: number): this {
    return this.addTest(
      (value) => value == null || value.length <= length,
      `must be at most ${length} characters`
    );
  }
};
