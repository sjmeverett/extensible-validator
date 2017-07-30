import test from 'ava';
import * as Validator from '../lib';


test('required', (t) => {
  let schema = new Validator.Any().required();
  t.deepEqual<Validator.ValidationResult>(schema.validate(''), [{message: 'required', path: null}]);
  t.deepEqual<Validator.ValidationResult>(schema.validate(null), [{message: 'required', path: null}]);
  t.deepEqual<Validator.ValidationResult>(schema.validate(undefined), [{message: 'required', path: null}]);
  t.deepEqual<Validator.ValidationResult>(schema.validate(false), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate(5), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate('a'), []);
});


test('string', (t) => {
  let schema = new Validator.String();
  t.deepEqual<Validator.ValidationResult>(schema.validate(''), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate('hi'), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate(null), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate(undefined), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate(false), [{message: 'must be a string', path: null}]);
  t.deepEqual<Validator.ValidationResult>(schema.validate(5), [{message: 'must be a string', path: null}]);
});


test('email', (t) => {
  let schema = new Validator.String().email();
  t.deepEqual<Validator.ValidationResult>(schema.validate(''), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate('testy@mctestface.uk'), []);
  t.deepEqual<Validator.ValidationResult>(schema.validate('boaty mcboatface'), [{message: 'must be an email address', path: null}]);
});


test('hash', (t) => {
  let schema = new Validator.Hash().keys({
    name: new Validator.String().required(),
    age: new Validator.Number()
  });

  t.deepEqual<Validator.ValidationResult>(
    schema.validate(null),
    []
  );

  t.deepEqual<Validator.ValidationResult>(
    schema.validate({name: 'Stewart'}),
    []
  );

  t.deepEqual<Validator.ValidationResult>(
    schema.validate({name: 'Stewart', age: 27}),
    []
  );

  t.deepEqual<Validator.ValidationResult>(
    schema.validate({}),
    [{message: 'required', path: 'name'}]
  );
});


test('deep hash', (t) => {
  let schema = new Validator.Hash().keys({
    name: new Validator.Hash().keys({
      first: new Validator.String().required(),
      last: new Validator.String().required()
    }),
    age: new Validator.Number()
  });

  t.deepEqual<Validator.ValidationResult>(
    schema.validate({name: {first: 'Stewart'}}),
    [{message: 'required', path: 'name.last'}]
  );
});


test('number', (t) => {
  let schema = new Validator.Number().integer();

  t.deepEqual<Validator.ValidationResult>(
    schema.validate('not a number'),
    [{message: 'must be a number', path: null}]
  );

  t.deepEqual<Validator.ValidationResult>(
    schema.validate(''),
    []
  );

  t.deepEqual<Validator.ValidationResult>(
    schema.validate(null),
    []
  );
});
