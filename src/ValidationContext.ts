/**
 * The context of a validation operation.
 */
export interface ValidationContext {
  /**
   * The sibling fields to the currently validating field in a Hash schema, if applicable.
   */
  model: {
    [key: string]: any;
  };
  /**
   * The path to the currently validating field in a Hash schema, if applicable.
   */
  path: string | null;
}
