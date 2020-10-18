import getContentType from './get-content-type.js';
import isOkResponse from './is-ok-response.js';

/**
 * @param {import('http').IncomingMessage} response
 *
 * @return {boolean}
 */
function isCrawlableResponse(response) {
	return isOkResponse(response) && getContentType(response) === 'text/html';
}

export default isCrawlableResponse;
