import * as _ from 'lodash';
import * as Core from './index';
import { Any } from './any';

export type KeyValidator = {[key: string]: Core.Validator};


/**
 * Requires a value to be a plain object.
 */
export class Hash extends Any {
  protected keyValidators: KeyValidator;

  constructor() {
    super((value) => value == null || _.isPlainObject(value), 'must be a plain object');
  }


  /**
   * Sets the schemas for each key of the object.
   * @param keyValidators A hash of schemas to keys.
   */
  keys(keyValidators: KeyValidator): this {
    let schema = super.clone();
    schema.keyValidators = keyValidators;
    schema.addRule({validate: (values, context) => schema._validateKeys(values, context)});
    return schema;
  }


  protected _validateKeys(values: {[key: string]: any}, _context?: Core.ValidationContext): Core.ValidationResult {
    let results: Core.ValidationResult = [];

    let context: Core.ValidationContext = _context 
      ? Object.assign({}, _context) 
      : {model: values, path: null};

    let basePath = context.path
      ? context.path + '.'
      : '';

    if (values == null)
      return [];

    for (let key in this.keyValidators) {
      context.path = basePath + key;
      let result = this.keyValidators[key].validate(values[key], context);
      results.push(...result);
    }

    return results;
  }


  clone(): this {
    const schema = super.clone();
    schema.keyValidators = this.keyValidators;
    return schema;
  }
};
