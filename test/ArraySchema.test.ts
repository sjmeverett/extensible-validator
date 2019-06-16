import { array, number } from '../src';
import { expect } from 'chai';

describe('ArraySchema', () => {
  describe('type', () => {
    const schema = array;

    it('passes undefined', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
    });

    it('passes null', () => {
      expect(schema.validate(null)).to.deep.equal([]);
    });

    it('fails number', () => {
      expect(schema.validate(5)).to.deep.equal([
        { message: 'must be an array', path: null },
      ]);
    });

    it('fails string', () => {
      expect(schema.validate('5')).to.deep.equal([
        { message: 'must be an array', path: null },
      ]);
    });

    it('passes empty array', () => {
      expect(schema.validate([])).to.deep.equal([]);
    });

    it('passes non-emtpy array', () => {
      expect(schema.validate([1, 2, 3])).to.deep.equal([]);
    });
  });

  describe('of()', () => {
    const schema = array.of(number);

    it('passes correct array', () => {
      expect(schema.validate([1, 2, 3])).to.deep.equal([]);
    });

    it('fails wrong array', () => {
      expect(schema.validate([1, '2', false])).to.deep.equal([
        { message: 'must be a number', path: '2' },
      ]);
    });
  });

  describe('cast()', () => {
    const schema = array.of(number);

    it('casts properly', () => {
      expect(schema.cast([1, '2'])).to.deep.equal([1, 2]);
    });
  });
});
