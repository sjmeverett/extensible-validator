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
});
