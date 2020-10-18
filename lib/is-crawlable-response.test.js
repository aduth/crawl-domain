import chai from 'chai';
import isCrawlableResponse from './is-crawlable-response.js';

const { expect } = chai;

describe('isCrawlableResponse', () => {
	it('returns false if response is not ok', () => {
		const result = isCrawlableResponse({
			statusCode: 500,
			headers: { 'content-type': 'text/html' },
		});

		expect(result).to.be.false;
	});

	it('returns false if content type is not html', () => {
		const result = isCrawlableResponse({
			statusCode: 200,
			headers: { 'content-type': 'image/jpg' },
		});

		expect(result).to.be.false;
	});

	it('returns true if response is ok and content type is html', () => {
		const result = isCrawlableResponse({
			statusCode: 200,
			headers: { 'content-type': 'text/html' },
		});

		expect(result).to.be.true;
	});
});
