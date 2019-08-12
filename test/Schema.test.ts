import { Schema } from '../src';
import { expect } from 'chai';

describe('Schema', () => {
  describe('required()', () => {
    const schema = new Schema().required();

    it('fails empty string', () => {
      expect(schema.validate('')).to.deep.equal([
        { message: 'required', path: null },
      ]);
    });

    it('fails null', () => {
      expect(schema.validate(null)).to.deep.equal([
        { message: 'required', path: null },
      ]);
    });

    it('fails undefined', () => {
      expect(schema.validate(undefined)).to.deep.equal([
        { message: 'required', path: null },
      ]);
    });

    it('passes false', () => {
      expect(schema.validate(false)).to.deep.equal([]);
    });

    it('passes number', () => {
      expect(schema.validate(5)).to.deep.equal([]);
    });

    it('passes non-empty string', () => {
      expect(schema.validate(null)).to.deep.equal([
        { message: 'required', path: null },
      ]);
    });

    it('requires value when passed function evaluates to true', () => {
      const schema = new Schema().required(() => true);
      expect(schema.validate('')).to.deep.equal([
        { message: 'required', path: null },
      ]);
      expect(schema.validate('.')).to.deep.equal([]);
    });

    it('does not require value when passed function evaluates to false', () => {
      const schema = new Schema().required(() => false);
      expect(schema.validate('')).to.deep.equal([]);
      expect(schema.validate('.')).to.deep.equal([]);
    });
  });

  describe('oneOf()', () => {
    const schema = new Schema().oneOf(['a', 'b']);

    it('passes expected value', () => {
      expect(schema.validate('a')).to.deep.equal([]);
    });

    it('fails unexpected value', () => {
      expect(schema.validate('c')).to.deep.equal([
        { message: 'must be one of: a, b', path: null },
      ]);
    });
  });

  describe('matches()', () => {
    const schema = new Schema().matches('b');

    it('passes when value matches', () => {
      expect(
        schema.validate('test', { model: { b: 'test' }, path: '' }),
      ).to.deep.equal([]);
    });

    it('fails when value does not match', () => {
      expect(
        schema.validate('test', { model: { b: 'test2' }, path: '' }),
      ).to.deep.equal([{ message: 'must match key b', path: null }]);
    });
  });
});
