/**
 * Returns the content type of a given response object.
 *
 * @see https://tools.ietf.org/html/rfc7231#section-3.1.1.1
 *
 * @param {import('http').IncomingMessage} response HTTP response object.
 *
 * @return {string} Content type.
 */
function getContentType(response) {
	const [type] = (response.headers['content-type'] || '').split(';');
	return type.trim();
}

export default getContentType;
