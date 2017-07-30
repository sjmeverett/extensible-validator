import * as _ from 'lodash';
import * as Core from './index';
import { Any } from './any';

export type KeyValidation = {[key: string]: Core.Validator};


/**
 * Requires a value to be a plain object.
 */
export class Hash extends Any {
  protected keyValidation: KeyValidation;

  constructor() {
    super((value) => value == null || _.isPlainObject(value), 'must be a plain object');
  }


  /**
   * Sets the validators for each key of the object.
   * @param keyValidation A hash of validators to keys.
   */
  keys(keyValidation: KeyValidation): this {
    let schema = super.clone();
    schema.keyValidation = keyValidation;
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

    for (let key in this.keyValidation) {
      context.path = basePath + key;
      let result = this.keyValidation[key].validate(values[key], context);
      results.push(...result);
    }

    return results;
  }


  clone(): this {
    const schema = super.clone();
    schema.keyValidation = this.keyValidation;
    return schema;
  }
};
