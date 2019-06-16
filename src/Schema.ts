import * as _ from 'lodash';
import { ValidationContext } from './ValidationContext';
import { ValidationError } from './ValidationError';

/**
 * Represents the result of validating a value.
 */
export type ValidationResult = ValidationError[];

export interface ValidationFn {
  (value: any, context?: ValidationContext): ValidationResult;
}

export interface TestFn {
  (value: any, context?: ValidationContext): boolean;
}

export type SchemaType<T> = T extends Schema<infer T> ? T : any;

const SchemaMessages = {
  type: 'invalid',
  required: 'required',
  unknown: 'unknown problem',
  matches: (key: string) => `must match key ${key}`,
};

/**
 * Base implementation of Validator interface.
 */
export class Schema<TResult = any, TOwnMessages = any> {
  /**
   * The rules that will be checked when `validate` is called.
   */
  protected _rules: ValidationFn[];

  protected _messages: typeof SchemaMessages & TOwnMessages = {} as any;

  private mutable = false;

  /**
   * Constructor.
   * @param typeTest test for membership of the represented type of the derived class
   */
  constructor(
    _messages?: Partial<typeof SchemaMessages> & TOwnMessages,
    protected typeTest?: (value: any) => boolean,
  ) {
    this._rules = [];
    this._messages = Object.assign({}, SchemaMessages, _messages);
  }

  /**
   * Validates the given value according to the schema.
   * @param value The value to validate
   * @param context An optional context object; currently used internally for Hash schemas and by `matches`
   */
  validate(value: any, context?: ValidationContext): ValidationResult {
    if (!this.isType(value)) {
      return [
        {
          message: this._messages.type || this._messages.unknown,
          path: (context && context.path) || null,
        },
      ];
    }

    return _.flatten(
      this._rules.map(rule => {
        try {
          return rule(value, context);
        } catch {
          return {
            message: this._messages.unknown,
            path: (context && context.path) || null,
          };
        }
      }),
    );
  }

  isType(value: any) {
    try {
      return !this.typeTest || this.typeTest(value);
    } catch {
      return false;
    }
  }

  messages(messages: Partial<typeof SchemaMessages & TOwnMessages>) {
    Object.assign(this._messages, messages);
  }

  /**
   * Require a value.
   */
  required(condition?: TestFn): this {
    return this.addTest(
      (value, context) =>
        (!condition || condition(value, context)) &&
        value != null &&
        value !== '',
      this._messages.required!,
    ) as any;
  }

  /**
   * Require the value to match the value of the given key in `context.model`.
   * @param key The key to match
   * @param message The error message to use if the value does not match (optional, defaults to 'must match key {key}')
   */
  matches(key: string, message?: string): this {
    return this.addTest(
      (value: any, context?: { [key: string]: any }) =>
        context != null && _.isPlainObject(context) && value == context[key],
      message || this._messages.matches(key),
    );
  }

  /**
   * Adds a rule to this schema, that will be checked when `validate` is called.
   * @param rule A rule to add
   */
  addRule(rule: ValidationFn): this {
    return this.clone(schema => {
      schema._rules.push(rule);
    });
  }

  /**
   * Adds a rule based on the supplied test function.
   * @param test A function which returns true if the value is valid; otherwise, false
   * @param message The error message to use if the test is false.
   */
  addTest(test: TestFn, message: string): this {
    return this.addRule((value: any, context?: ValidationContext) =>
      this._test(test(value, context), message, context),
    );
  }

  /**
   * Returns either a `ValidResult` if `test` is true, or a `NotValidResult` with the specified error message(s) if `test` is false.
   * @param test True to return a `ValidResult`, false to return a `NotValidResult`
   * @param messages A string or array of strings to use as error message(s)
   * @param context The validation context, for determining the error path
   */
  protected _test(
    test: boolean,
    messages: string | string[],
    context?: ValidationContext,
  ): ValidationResult {
    const path = (context && context.path) || null;

    if (test) {
      return [];
    } else if (Array.isArray(messages)) {
      return messages.map(message => ({ message, path }));
    } else {
      return [{ message: messages, path }];
    }
  }

  /**
   * Clones the current instance.
   */
  clone(mutator?: (schema: this) => void): this {
    const schema = this.mutable ? this : _.cloneDeep(this);

    if (mutator) {
      const mutable = schema.mutable;
      schema.mutable = true;
      mutator(schema);
      schema.mutable = mutable;
    }

    return schema;
  }

  /**
   * Returns the value casted to the target type.
   */
  cast(value: any): TResult {
    return value;
  }
}
