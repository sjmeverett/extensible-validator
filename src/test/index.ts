import test from 'ava';
import * as Schema from '../lib';


test('required', (t) => {
  let schema = new Schema.Any().required();
  t.deepEqual<Schema.ValidationResult>(schema.validate(''), [{message: 'required', path: null}]);
  t.deepEqual<Schema.ValidationResult>(schema.validate(null), [{message: 'required', path: null}]);
  t.deepEqual<Schema.ValidationResult>(schema.validate(undefined), [{message: 'required', path: null}]);
  t.deepEqual<Schema.ValidationResult>(schema.validate(false), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate(5), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate('a'), []);
});


test('string', (t) => {
  let schema = new Schema.String();
  t.deepEqual<Schema.ValidationResult>(schema.validate(''), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate('hi'), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate(null), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate(undefined), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate(false), [{message: 'must be a string', path: null}]);
  t.deepEqual<Schema.ValidationResult>(schema.validate(5), [{message: 'must be a string', path: null}]);
});


test('email', (t) => {
  let schema = new Schema.String().email();
  t.deepEqual<Schema.ValidationResult>(schema.validate(''), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate('testy@mctestface.uk'), []);
  t.deepEqual<Schema.ValidationResult>(schema.validate('boaty mcboatface'), [{message: 'must be an email address', path: null}]);
});


test('hash', (t) => {
  let schema = new Schema.Hash().keys({
    name: new Schema.String().required(),
    age: new Schema.Number()
  });

  t.deepEqual<Schema.ValidationResult>(
    schema.validate(null),
    []
  );

  t.deepEqual<Schema.ValidationResult>(
    schema.validate({name: 'Stewart'}),
    []
  );

  t.deepEqual<Schema.ValidationResult>(
    schema.validate({name: 'Stewart', age: 27}),
    []
  );

  t.deepEqual<Schema.ValidationResult>(
    schema.validate({}),
    [{message: 'required', path: 'name'}]
  );
});


test('deep hash', (t) => {
  let schema = new Schema.Hash().keys({
    name: new Schema.Hash().keys({
      first: new Schema.String().required(),
      last: new Schema.String().required()
    }),
    age: new Schema.Number()
  });

  t.deepEqual<Schema.ValidationResult>(
    schema.validate({name: {first: 'Stewart'}}),
    [{message: 'required', path: 'name.last'}]
  );
});


test('number', (t) => {
  let schema = new Schema.Number().integer();

  t.deepEqual<Schema.ValidationResult>(
    schema.validate('not a number'),
    [{message: 'must be a number', path: null}]
  );

  t.deepEqual<Schema.ValidationResult>(
    schema.validate(''),
    []
  );

  t.deepEqual<Schema.ValidationResult>(
    schema.validate(null),
    []
  );
});
