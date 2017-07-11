# extensible-validator

Typescript-friendly and extensible object and value validation.  It looks mostly like [joi](https://www.npmjs.com/package/joi),
but is more extensible and auto-complete friendly.

## Usage

Install:

    $ npm install --save extensible-validator

Import, then define and use a schema:

```js
import * as Validator from 'extensible-validator';

let validator = new Validator.Hash().keys({
  name: new Validator.String().required(),
  age: new Validator.Number().integer()
});

let person = {name: 'Bob', age: 32};
console.log(validator.validate(person));
// []

let notAPerson = {age: "what's my age again?"};
console.log(validator.validate(notAPerson));
// [{message: 'required', path: 'name'}, {message: 'must be a number', path: 'age'}]
```

Extend validator functionality:

```js
class MyString extends Validator.String {
  objectId(): this {
    return this.regex(/^[0-9a-f]{24}$/i);
  }
};

let post = new Validator.Hash().keys({
  id: new MyString().required().objectId(),
  title: new MyString().required(),
  description: new MyString()
});
```

## API (edited highlights)

### `Validator` interface

Represents a validator instance.  In reality you probably won't have to deal with this
interface very much directly, unless you are making your own validators from scratch.

### `Any` class (implements `Validator`)

The base implementation - all shipped validators derive from this.  Note that rules
return a shallow copy.

#### `constructor(typeTest: (value: any) => boolean, message: string)`

Allows you to specify a "type test", that is, a rule that is run before any others
in order to check if the value is a member of the type represented by the schema.  The
`message` parameter is the message to return if this is not the case, e.g., "must be a number".  This is the mechanism that the derived classes e.g. `Number` and `String`
use to make sure the value is a number or a string respectively.

#### `validate(value: any, context?: ValidationContext): ValidationResult`

Runs the type test if given, and any other rules defined using `_addRule` or
`_addTest`.

#### `required(): this`

Adds a rule that requires a value to exist.

#### `matches(key: string, message?: string): this`

Adds a rule that requires the value to match another sibling key, e.g. for
"confirm password" fields.

#### `addRule(rule: Schema): this`

Adds a rule to run when `validate` is called.

#### `addTest(test: (value: any, context?: ValidationContext) => boolean, message: string): this`

Adds a rule to run when `validate` is called, based on the supplied test function.


### `Hash` class (extends `Any`)

Requires the value to be a plain object.

#### `keys(keyValidators: {[key: string]: Validator}): this`

Sets the validators for each key of the object.


### `Number` class (extends `Any`)

Requires the value to be a number, or a string representing a number.

#### `integer(): this`

Requires the number not to have any decimal places.

#### `decimalPlaces(max: number): this`

Requires the number to have no more than the specified number of decimal places.

#### `decimalPlaces(min: number, max: number): this`

Requires the number to have a number of decimal places within the specified range.


### `String` class (extends `Any`)

Requires the value to be a string.

#### `regex(regex: RegExp, message?: string): this`

Requires the value to match the specified regex.

#### `email(): this`

Requires the value to be an email address.

#### `min(length: number): this`

Requires the value to be at least the specified number of characters long.

#### `max(length: number): this`

Requires the value to be at most the specfied number of characters long.
