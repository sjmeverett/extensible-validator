import { Schema } from './Schema';

const booleanMessages = {
  type: 'must be a boolean',
};

/**
 * Requires the valufe to be a boolean, 'true', or 'false'.
 */
export class BooleanSchema extends Schema<
  boolean | undefined | null,
  typeof booleanMessages
> {
  constructor() {
    super(
      booleanMessages,
      value =>
        value == null ||
        value === '' ||
        value === true ||
        value === false ||
        value === 'true' ||
        value === 'false',
    );
  }

  cast(value: any) {
    if (value == null) {
      return value;
    }

    return value === true || value === 'true';
  }
}

export const boolean = new BooleanSchema();
