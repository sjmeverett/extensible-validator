import * as _ from 'lodash';
import * as Core from './index';

/**
 * Base implementation of Validator interface.
 */
export class Any implements Core.Validator {
  /**
   * The rules that will be checked when `validate` is called.
   */
  protected _rules: Core.Validator[];


  /**
   * Constructor.
   */
  constructor();
  /**
   * Constructor.
   * @param typeTest test for membership of the represented type of the derived class
   * @param message the error message to use if the type test does not pass
   */
  constructor(typeTest: (value: any) => boolean, message: string);
  constructor(private typeTest?: (value: any) => boolean, private message?: string) {
    this._rules = [];
  }


  /**
   * Validates the given value according to the schema. 
   * @param value The value to validate
   * @param context An optional context object; currently used internally for Hash schemas and by `matches`
   */
  validate(value: any, context?: Core.ValidationContext): Core.ValidationResult {
    if (this.typeTest && !this.typeTest(value)) {
      return [{message: this.message, path: context && context.path || null}];
    }

    return [].concat(
      ...this._rules
        .map((rule) => rule.validate(value, context))
    );
  }


  /**
   * Require a value.
   */
  required(): this {
    return this.addTest(
      (value) => value != null && value !== '',
      'required'
    );
  }


  /**
   * Require the value to match the value of the given key in `context.model`.
   * @param key The key to match
   * @param message The error message to use if the value does not match (optional, defaults to 'must match key {key}')
   */
  matches(key: string, message?: string): this{
    return this.addTest(
      (value: any, context?: {[key: string]: any}) => context != null && _.isPlainObject(context) && value == context[key],
      message || `must match key ${key}`
    );
  }


  /**
   * Adds a rule to this schema, that will be checked when `validate` is called.
   * @param rule A rule to add
   */
  addRule(rule: Core.Validator): this {
    let schema = this.clone();
    schema._rules.push(rule);
    return schema;
  }


  /**
   * Adds a rule based on the supplied test function.
   * @param test A function which returns true if the value is valid; otherwise, false
   * @param message The error message to use if the test is false.
   */
  addTest(test: (value: any, context?: Core.ValidationContext) => boolean, message: string): this {
    return this.addRule({
      validate: (value: any, context?: Core.ValidationContext) => this._test(test(value, context), message, context)
    });
  }


  /**
   * Returns either a `ValidResult` if `test` is true, or a `NotValidResult` with the specified error message(s) if `test` is false.
   * @param test True to return a `ValidResult`, false to return a `NotValidResult`
   * @param messages A string or array of strings to use as error message(s)
   * @param context The validation context, for determining the error path
   */
  protected _test(test: boolean, messages: string | string[], context: Core.ValidationContext): Core.ValidationResult {
    const path = context && context.path || null;

    if (test) {
      return [];

    } else if (Array.isArray(messages)) {
      return messages.map((message) => ({message, path}));

    } else {
      return [{message: messages, path}];
    }
  }


  /**
   * Shallow copies the current instance.  Must be overrided in a derived class if any new fields are added.
   */
  clone(): this {
    const validator = Object.create(Object.getPrototypeOf(this));
    validator._rules = this._rules || [];
    validator.typeTest = this.typeTest;
    validator.message = this.message;
    return validator;
  }
};
