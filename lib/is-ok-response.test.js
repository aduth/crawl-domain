import chai from 'chai';
import isOkResponse from './is-ok-response.js';

const { expect } = chai;

describe('isOkResponse', () => {
	it('returns false if status code is not assigned', () => {
		const result = isOkResponse({});

		expect(result).to.be.false;
	});

	it('returns false if status code is not 2xx', () => {
		const result = isOkResponse({ statusCode: 500 });

		expect(result).to.be.false;
	});

	it('returns false if status code is 2xx', () => {
		const result = isOkResponse({ statusCode: 202 });

		expect(result).to.be.true;
	});
});
