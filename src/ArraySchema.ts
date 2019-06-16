import { Schema } from './Schema';
import * as _ from 'lodash';
import { ValidationContext } from './ValidationContext';

const arrayMessages = {
  type: 'must be an array',
};

export class ArraySchema<T> extends Schema<T[], typeof arrayMessages> {
  private elementSchema?: Schema<T>;

  constructor() {
    super(
      arrayMessages,
      value => value == null || value === '' || _.isArray(value),
    );
  }

  of<T>(elementSchema: Schema<T>): ArraySchema<T> {
    return this.clone(schema => {
      schema.elementSchema = elementSchema as any;

      schema.addRule((value, context) => {
        return schema._validateElements(value, context);
      });
    }) as any;
  }

  protected _validateElements(
    values: any,
    context: ValidationContext = { model: values, path: null },
  ) {
    const basePath = context.path ? context.path + '.' : '';

    if (values == null) return [];

    return _.flatMap(values, (value, i) => {
      return this.elementSchema!.validate(value, {
        ...context,
        path: basePath + i,
      });
    });
  }

  cast(value: any): T[] {
    if (!this.elementSchema) {
      return value;
    }

    return value.map((value: any) => this.elementSchema!.cast(value));
  }
}

export const array = new ArraySchema();
