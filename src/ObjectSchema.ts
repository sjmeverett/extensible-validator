import * as _ from 'lodash';
import { Schema, ValidationResult } from './Schema';
import { ValidationContext } from './ValidationContext';

export type KeyValidation<T = any> = { [K in keyof T]: Schema<T[K]> };

const objectMessages = {
  type: 'must be a plain object',
};

/**
 * Requires a value to be a plain object.
 */
export class ObjectSchema<T> extends Schema<T> {
  protected keyValidation: KeyValidation;

  constructor() {
    super(objectMessages, value => value == null || _.isPlainObject(value));
  }

  /**
   * Sets the validators for each key of the object.
   * @param keyValidation A hash of validators to keys.
   */
  keys<T>(keyValidation: KeyValidation<T>): ObjectSchema<T> {
    return super.clone(schema => {
      schema.keyValidation = keyValidation;

      schema.addRule((values, context) =>
        schema._validateKeys(values, context),
      );
    }) as any;
  }

  protected _validateKeys(
    values: { [key: string]: any },
    _context?: ValidationContext,
  ): ValidationResult {
    const results: ValidationResult = [];

    const context: ValidationContext = _context
      ? Object.assign({}, _context)
      : { model: values, path: null };

    const basePath = context.path ? context.path + '.' : '';

    if (values == null) return [];

    for (const key in this.keyValidation) {
      context.path = basePath + key;

      const result = this.keyValidation[key].validate(values[key], context);
      results.push(...result);
    }

    return results;
  }

  cast(value: any) {
    if (!this.keyValidation) {
      return value;
    }

    const result = {} as any;

    for (const k in this.keyValidation) {
      result[k] = this.keyValidation[k].cast(value[k]);
    }

    return result;
  }
}

export const object = new ObjectSchema();
