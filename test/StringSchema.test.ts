import { string } from '../src';
import { expect } from 'chai';

describe('StringSchema', () => {
  describe('type', () => {
    const schema = string;

    it('passes empty string', () => {
      expect(schema.validate('')).to.deep.equal([]);
    });

    it('passes non-empty string', () => {
      expect(schema.validate('hi')).to.deep.equal([]);
    });

    it('passes null', () => {
      expect(schema.validate(null)).to.deep.equal([]);
    });

    it('passes undefined', () => {
      expect(schema.validate(undefined)).to.deep.equal([]);
    });

    it('passes number', () => {
      expect(schema.validate(5)).to.deep.equal([]);
      expect(schema.cast(5)).to.equal('5');
    });

    it('passes boolean', () => {
      expect(schema.validate(false)).to.deep.equal([]);
      expect(schema.cast(false)).to.equal('false');
    });

    it('fails if toString throws', () => {
      expect(
        schema.validate({
          toString() {
            throw Error();
          },
        }),
      ).to.deep.equal([{ message: 'must be a string', path: null }]);
    });
  });

  describe('email()', () => {
    const schema = string.email();

    it('passes empty string', () => {
      expect(schema.validate('')).to.deep.equal([]);
    });

    it('passes an email address', () => {
      expect(schema.validate('test+123@example.com')).to.deep.equal([]);
    });

    it('fails an invalid email address', () => {
      expect(schema.validate('fish and chips')).to.deep.equal([
        { message: 'must be an email address', path: null },
      ]);
    });
  });
});
