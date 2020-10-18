import chai from 'chai';
import getNormalizedURL from './get-normalized-url.js';

const { expect } = chai;

describe('getNormalizedURL', () => {
	it('returns null for invalid url', () => {
		const result = getNormalizedURL('../baz', '');

		expect(result).to.be.null;
	});

	it('returns string from url fragment and base', () => {
		const result = getNormalizedURL('../baz', 'https://example.com/foo/bar');

		expect(result).to.equal('https://example.com/baz');
	});

	it('normalizes root URL', () => {
		const result = getNormalizedURL('https://example.com');

		expect(result).to.equal('https://example.com/');
	});

	it('omits hash fragment', () => {
		const result = getNormalizedURL('https://example.com#hash');

		expect(result).to.equal('https://example.com/');
	});
});
