import { date } from '../src';
import { expect } from 'chai';
import * as moment from 'moment';

describe('DateSchema', () => {
  describe('type', () => {
    const schema = date;

    it('passes a date', () => {
      expect(schema.validate(new Date())).to.deep.equal([]);
    });

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
        { message: 'must be a date', path: null },
      ]);
    });

    it('fails string', () => {
      expect(schema.validate('5')).to.deep.equal([
        { message: 'must be a date', path: null },
      ]);
    });

    it('fails object', () => {
      expect(schema.validate({})).to.deep.equal([
        { message: 'must be a date', path: null },
      ]);
    });
  });

  describe('format', () => {
    const schema = date.format('HH:mm');

    it('passes correct format', () => {
      expect(schema.validate('19:44')).to.deep.equal([]);
      const value = schema.cast('19:44');
      expect(moment(value).format('HH:mm')).to.equal('19:44');
    });

    it('fails incorrect format', () => {
      expect(schema.validate('2019-06-16')).to.deep.equal([
        { message: 'must match format HH:mm', path: null },
      ]);
    });
  });

  describe('castFormat', () => {
    const schema = date.format('DD/MM/YYYY').castFormat('YYYY-MM-DD');

    it('converts to the right format', () => {
      expect(schema.cast('09/11/1989')).to.equal('1989-11-09');
    });
  });
});
