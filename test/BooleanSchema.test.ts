import { boolean } from '../src';
import { expect } from 'chai';

describe('BooleanSchema', () => {
  describe('type', () => {
    const schema = boolean;

    it('passes undefined', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
      expect(schema.cast(undefined)).to.equal(undefined);
    });

    it('passes null', () => {
      expect(schema.validate(null)).to.deep.equal([]);
      expect(schema.cast(null)).to.equal(null);
    });

    it('fails number', () => {
      expect(schema.validate(5)).to.deep.equal([
        { message: 'must be a boolean', path: null },
      ]);
    });

    it('fails string', () => {
      expect(schema.validate('5')).to.deep.equal([
        { message: 'must be a boolean', path: null },
      ]);
    });

    it('passes true', () => {
      expect(schema.validate(true)).to.deep.equal([]);
    });

    it('passes false', () => {
      expect(schema.validate(false)).to.deep.equal([]);
    });

    it('passes "true"', () => {
      expect(schema.validate('true')).to.deep.equal([]);
      expect(schema.cast('true')).to.equal(true);
    });

    it('passes "false"', () => {
      expect(schema.validate('false')).to.deep.equal([]);
      expect(schema.cast('false')).to.equal(false);
    });
  });
});
