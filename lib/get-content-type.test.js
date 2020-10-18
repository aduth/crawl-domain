import chai from 'chai';
import getContentType from './get-content-type.js';

const { expect } = chai;

describe('getContentType', () => {
	it('returns content type from header with params', () => {
		const result = getContentType({ headers: { 'content-type': 'text/html; charset=utf-8' } });

		expect(result).to.equal('text/html');
	});

	it('returns content type from header with optional whitespace', () => {
		const result = getContentType({ headers: { 'content-type': 'text/html ; charset=utf-8' } });

		expect(result).to.equal('text/html');
	});
});
