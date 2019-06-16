import { object, string, number } from '../src';
import { expect } from 'chai';

describe('ObjectSchema', () => {
  describe('type', () => {
    const schema = object;

    it('passes empty object', () => {
      expect(schema.validate({})).to.deep.equal([]);
    });

    it('passes undefined', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
    });

    it('passes null', () => {
      expect(schema.validate(null)).to.deep.equal([]);
    });

    it('fails number', () => {
      expect(schema.validate(5)).to.deep.equal([
        { message: 'must be a plain object', path: null },
      ]);
    });

    it('fails string', () => {
      expect(schema.validate('5')).to.deep.equal([
        { message: 'must be a plain object', path: null },
      ]);
    });

    it('fails non-plain object', () => {
      class Foo {}

      expect(schema.validate(new Foo())).to.deep.equal([
        { message: 'must be a plain object', path: null },
      ]);
    });
  });

  describe('keys()', () => {
    const schema = object.keys({
      name: string.required(),
      age: number,
    });

    it('passes the correct object', () => {
      expect(schema.validate({ name: 'Stewart', age: 29 })).to.deep.equal([]);
    });

    it('fails the wrong object', () => {
      expect(schema.validate({ name: '', age: 'frobble' })).to.deep.equal([
        { message: 'required', path: 'name' },
        { message: 'must be a number', path: 'age' },
      ]);
    });
  });

  describe('cast()', () => {
    const schema = object.keys({ n: number });

    it('casts properly', () => {
      expect(schema.cast({ n: '5', o: true })).to.deep.equal({ n: 5 });
    });
  });
});
