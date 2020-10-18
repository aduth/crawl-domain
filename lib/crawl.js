import { get } from 'http-or-https';
import { PassThrough, pipeline } from 'stream';
import { promisify } from 'util';
import htmlparser2 from 'htmlparser2';
import parallel from 'parallel-transform';
import decompressResponse from 'decompress-response';
import getNormalizedURL from './get-normalized-url.js';
import isCrawlableResponse from './is-crawlable-response.js';

/** @typedef {(error: Error?, urls: string[])=>void} CrawlCallback */
/** @typedef {(rootURL: string, options?:CrawlOptions)=>Promise<string[]>} CrawlPromise */

/**
 * @typedef CrawlOptions
 *
 * @prop {number} concurrency HTTP client concurrency. Defaults to `10`.
 * @prop {number} timeout HTTP client timeout, in milliseconds. Defaults to `10000`.
 */

/** @type {CrawlCallback} */
const DEFAULT_CALLBACK = () => {};

/** @type {CrawlOptions} */
const DEFAULT_OPTIONS = { concurrency: 10, timeout: 10000 };

/**
 * Crawls for URLs under a given root URL domain.
 *
 * @param {string} rootURL Root URL
 * @param {Partial<CrawlOptions>=} options Crawl options.
 * @param {CrawlCallback=} callback Callback function.
 *
 * @return {import('stream').Stream} Stream result.
 */
function crawl(rootURL, options = {}, callback = DEFAULT_CALLBACK) {
	if (callback === DEFAULT_CALLBACK && typeof options === 'function') {
		return crawl(rootURL, undefined, options);
	}

	const { concurrency, timeout } = { ...DEFAULT_OPTIONS, ...options };

	rootURL = /** @type {string} */ (getNormalizedURL('./', rootURL));
	const result = /** @type {string[]} */ ([]);
	const seen = /** @type {Set<string>} */ (new Set());
	const pending = /** @type {Set<string>} */ (new Set());
	const queue = new PassThrough({ encoding: 'utf8', objectMode: true });

	/**
	 * Adds URL to queue to crawl if valid and not yet seen.
	 *
	 * @param {string?} url URL to add.
	 */
	function add(url) {
		if (url && url.startsWith(rootURL) && !seen.has(url)) {
			seen.add(url);
			pending.add(url);
			queue.push(url);
		}
	}

	const createParser = () =>
		new htmlparser2.Parser({
			onopentag(name, { href }) {
				if (name === 'a' && href) add(getNormalizedURL(href, rootURL));
			},
		});

	const fetch = parallel(concurrency, (url, callback) => {
		const urlAsString = url.toString();

		const request = get(urlAsString, async (response) => {
			response = decompressResponse(response);

			const { location } = response.headers;
			if (location) {
				add(getNormalizedURL(location, urlAsString));
			} else if (isCrawlableResponse(response)) {
				const parser = createParser();
				for await (const chunk of response) {
					parser.write(chunk);
				}

				extract.write(urlAsString);
			}

			pending.delete(urlAsString);
			if (!pending.size) {
				queue.end();
			}

			callback();
		});

		request.setTimeout(timeout);
	});

	const extract = new PassThrough({ encoding: 'utf8', objectMode: true });
	extract.on('data', (url) => result.push(url));

	add(rootURL);
	return pipeline(queue, fetch, extract, () => callback(null, result));
}

export const stream = crawl;

export const promise = /** @type {CrawlPromise} */ (promisify(crawl));

export default stream;
