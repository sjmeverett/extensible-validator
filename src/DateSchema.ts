import { Schema } from './Schema';
import * as moment from 'moment';
import * as _ from 'lodash';

const dateMessages = {
  type: 'must be a date',
  format: (format: string) => `must match format ${format}`,
};

export class DateSchema<TResult extends string | Date = Date> extends Schema<
  TResult,
  typeof dateMessages
> {
  private _parseFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  private _castFormat?: string;

  constructor() {
    super(dateMessages);
  }

  protected typeTest = function(this: DateSchema, value: any) {
    console.log({ value });
    console.log(this._parseFormat);

    return (
      value === '' ||
      value == null ||
      value instanceof Date ||
      (_.isString(value) &&
        (moment(value, this._parseFormat, true).isValid() ||
          (this._castFormat != null &&
            moment(value, this._castFormat, true).isValid())))
    );
  };

  format(format: string) {
    return this.clone(schema => {
      schema._parseFormat = format;
      schema._messages.type = schema._messages.format(format);
    });
  }

  castFormat(format: string): DateSchema<string> {
    return this.clone(schema => {
      schema._castFormat = format;
    });
  }

  cast(value: any) {
    if (this._castFormat) {
      return (value instanceof Date
        ? moment(value)
        : moment(value, this._parseFormat)
      ).format(this._castFormat) as any;
    } else {
      return (value instanceof Date
        ? value
        : moment(value, this._parseFormat).toDate()) as any;
    }
  }
}

export const date = new DateSchema();
