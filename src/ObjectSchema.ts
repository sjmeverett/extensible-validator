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
    context: ValidationContext = { model: values, path: null },
  ): ValidationResult {
    const basePath = context.path ? context.path + '.' : '';

    if (values == null) return [];

    return _.flatMap(this.keyValidation, (schema, key) => {
      return schema.validate(values[key], { ...context, path: basePath + key });
    });
  }

  cast(value: any): T {
    if (!this.keyValidation || value == null) {
      return value;
    }

    return _.mapValues(this.keyValidation, (schema, key) => {
      return schema.cast(value[key]);
    });
  }
}

export const object = new ObjectSchema();
