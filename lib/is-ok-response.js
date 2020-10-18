/**
 * @param {import('http').IncomingMessage} response
 *
 * @return {boolean}
 */
function isOkResponse(response) {
	return Boolean(response.statusCode?.toString().startsWith('2'));
}

export default isOkResponse;
