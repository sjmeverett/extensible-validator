import { number } from '../src';
import { expect } from 'chai';

describe('NumberSchema', () => {
  describe('type', () => {
    const schema = number;

    it('passes undefined', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
    });

    it('passes null', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
    });

    it('passes 0', () => {
      expect(schema.validate(0)).to.deep.equal([]);
    });

    it('passes a number', () => {
      expect(schema.validate(5)).to.deep.equal([]);
    });

    it('passes a numeric string', () => {
      expect(schema.validate('5')).to.deep.equal([]);
      expect(schema.cast('5')).to.equal(5);
    });

    it('fails a dodgy numeric string', () => {
      expect(schema.validate('5.5.5')).to.deep.equal([
        { message: 'must be a number', path: null },
      ]);
    });

    it('fails a boolean', () => {
      expect(schema.validate(false)).to.deep.equal([
        { message: 'must be a number', path: null },
      ]);
    });

    it('fails a non-numeric string', () => {
      expect(schema.validate('frobble')).to.deep.equal([
        { message: 'must be a number', path: null },
      ]);
    });

    it('fails an object', () => {
      expect(schema.validate({})).to.deep.equal([
        { message: 'must be a number', path: null },
      ]);
    });
  });

  describe('integer()', () => {
    const schema = number.integer();

    it('passes undefined', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
    });

    it('passes null', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
    });

    it('passes a whole number', () => {
      expect(schema.validate(5)).to.deep.equal([]);
    });

    it('fails a fractional number', () => {
      expect(schema.validate(5.5)).to.deep.equal([
        { message: 'must be a whole number', path: null },
      ]);
    });

    it('fails a fractional string', () => {
      expect(schema.validate('5.5')).to.deep.equal([
        { message: 'must be a whole number', path: null },
      ]);
    });
  });
});
