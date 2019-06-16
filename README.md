# extensible-validator

Typescript-friendly and extensible object and value validation. It looks mostly like
[joi](https://www.npmjs.com/package/joi),
but is more extensible and auto-complete friendly.

Also, unlike like other libraries where `validate` throws an error, I just return an array of errors, which could be empty. Throwing an error in the case of bad input from a function which exists to consider the case of bad input is ugly as hell.

I also separate validating and "casting" the input to a desired output format, because they're two separate operations.

## Usage

Install:

    $ npm install --save extensible-validator

Import, then define and use a schema:

```js
import { object, string, number } from 'extensible-validator';

let validator = object.keys({
  name: string.required(),
  age: number.integer(),
});

let person = { name: 'Bob', age: 32 };
console.log(validator.validate(person));
// []

let notAPerson = { age: "what's my age again?" };
console.log(validator.validate(notAPerson));
// [{message: 'required', path: 'name'}, {message: 'must be a number', path: 'age'}]
```

If you want to extend the validator functionality, you can either add tests to existing types:

```js
const objectId = string.addTest(value => ObjectId.isValid(value));

const person = object.keys({
  _id: objectId.required(),
  name: string.required(),
});
```

Or you can define a new schema class:

```js
class ObjectIdSchema extends Schema<ObjectId> {
  constructor() {
    super({ type: 'must be an ObjectId' }, value => ObjectId.isValid(value));
  }

  cast(value: any) {
    return value instanceof ObjectId ? value : new ObjectId(value);
  }
}
```

The latter gives you more control, and the ability to override the type test and the `cast` method.

> TODO
