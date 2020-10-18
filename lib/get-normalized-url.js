/**
 * Given a URL (or URL fragment) and optional base URL, returns a normalized URL string, or null if
 * the URL fails to parse. A normalized URL will omit any hash fragment, and substitute an empty
 * path with root path.
 *
 * @param {string} url URL or URL fragment.
 * @param {string=} base Base URL.
 *
 * @return {string?} Normalized URL string, or null if the URL fails to parse.
 */
function getNormalizedURL(url, base) {
	let parsedURL;
	try {
		parsedURL = new URL(url, base);
	} catch {
		return null;
	}

	parsedURL.hash = '';
	return parsedURL.toString();
}

export default getNormalizedURL;
