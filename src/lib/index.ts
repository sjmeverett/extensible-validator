import * as _ from 'lodash';

/**
 * Represents a validation error.
 */
export interface ValidationError {
  /**
   * Why the validation was unsucessful.
   */
  message: string;
  /**
   * The path to the key (if under a Hash schema), or null.
   */
  path: string;
};


/**
 * Represents the result of validating a value.
 */
export type ValidationResult = ValidationError[];


/**
 * The context of a validation operation.
 */
export interface ValidationContext {
  /**
   * The sibling fields to the currently validating field in a Hash schema, if applicable.
   */
  model: {[key: string]: any};
  /**
   * The path to the currently validating field in a Hash schema, if applicable.
   */
  path: string;
};


/**
 * A schema is an object which can validate a given value according to some arbitrary internal rules.
 */
export interface Validator {
  /**
   * Validates the given value.
   * @param value the value to validate
   * @param context the validation context (optional)
   */
  validate(value: any, context?: ValidationContext): ValidationResult;
};

export * from './any';
export * from './string';
export * from './number';
export * from './hash';
