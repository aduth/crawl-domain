# crawl-domain

Crawl to discover all paths under a given URL domain.

## Example

```js
import crawl from 'crawl-domain';

for await (const url of crawl('http://localhost:3000')) {
	console.log(url);
}

// → http://localhost:5000/
// → http://localhost:5000/b
// → http://localhost:5000/c
// → http://localhost:5000/d
```

## Installation

`crawl-domain` is authored as an [ESM module](https://nodejs.org/api/esm.html), and therefore requires Node 12.0 or newer.

Install using NPM or Yarn:

```
npm install crawl-domain
```

```
yarn add crawl-domain
```

## Usage

The default export will return a [Node pipeline stream](https://nodejs.org/api/stream.html#stream_stream) when called, which can be [iterated asynchronously with `for await`](https://2ality.com/2019/11/nodejs-streams-async-iteration.html) to operate on crawled links as soon as they're discovered:

```js
import crawl from 'crawl-domain';

for await (const url of crawl('http://localhost:3000')) {
	console.log(url);
}
```

If you'd prefer not to use streams, there are also Node-style callback and promise forms available, where the resolved value will be an array of all discovered URLs:

```js
import crawl from 'crawl-domain';

crawl('http://localhost:3000', (error, urls) => {
	console.log(urls);
});
```

```js
import { promise as crawl } from 'crawl-domain';

const urls = await crawl('http://localhost:3000');
console.log(urls);
```

## Options

`crawl` can optionally receive an options object as the second argument.

The following options are supported:

- `concurrency`: HTTP client concurrency. Defaults to `10`.
- `timeout`: HTTP client timeout, in milliseconds. Defaults to `10000`.

## API

```ts
export function stream(
	rootURL: string,
	options?: Partial<CrawlOptions> | undefined,
	callback?: CrawlCallback | undefined
): import('stream').Stream;

export const promise: CrawlPromise;

export default stream;

export type CrawlOptions = {
	concurrency: number;
	timeout: number;
};

export type CrawlCallback = (error: Error | null, urls: string[]) => void;
export type CrawlPromise = (
	rootURL: string,
	options?: CrawlOptions | undefined
) => Promise<string[]>;
```

## License

Copyright 2020 Andrew Duthie

Released under the MIT License. See [LICENSE.md](./LICENSE.md).
