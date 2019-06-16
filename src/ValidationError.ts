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
  path: string | null;
}
