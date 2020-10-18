import { createServer } from 'http';
import handler from 'serve-handler';
import getPort from 'get-port';
import chai from 'chai';
import crawl, { stream as crawlStream, promise as crawlPromise } from './crawl.js';

const { expect } = chai;

describe('crawl', () => {
	/** @type {string} */
	let rootURL;

	/** @type {import('http').Server} */
	let server;

	before(async () => {
		const port = await getPort();

		server = createServer((request, response) => {
			return handler(request, response, {
				public: 'test/fixtures',
				redirects: [{ source: 'redirect-to-d', destination: 'd.html' }],
			});
		}).listen(port);

		rootURL = `http://localhost:${port}`;
	});

	after((done) => {
		server.close(done);
	});

	describe('default', () => {
		it('crawls unique urls', async () => {
			let urls = [];
			for await (const url of crawl(rootURL)) urls.push(url);
			expect(urls).to.have.members([`${rootURL}/`, `${rootURL}/b`, `${rootURL}/c`, `${rootURL}/d`]);
		});
	});

	describe('stream', () => {
		it('crawls unique urls', async () => {
			let urls = [];
			for await (const url of crawlStream(rootURL)) urls.push(url);
			expect(urls).to.have.members([`${rootURL}/`, `${rootURL}/b`, `${rootURL}/c`, `${rootURL}/d`]);
		});
	});

	describe('callback', () => {
		it('crawls unique urls', () => {
			return new Promise((resolve) => {
				crawl(rootURL, (error, urls) => {
					expect(error).to.be.null;
					expect(urls).to.have.members([
						`${rootURL}/`,
						`${rootURL}/b`,
						`${rootURL}/c`,
						`${rootURL}/d`,
					]);
					resolve();
				});
			});
		});
	});

	describe('promise', () => {
		it('crawls unique urls', async () => {
			const urls = await crawlPromise(rootURL);
			expect(urls).to.have.members([`${rootURL}/`, `${rootURL}/b`, `${rootURL}/c`, `${rootURL}/d`]);
		});
	});

	context('options', () => {
		it('accepts options as second argument', (done) => {
			crawl(rootURL, {}, done);
		});
	});
});
