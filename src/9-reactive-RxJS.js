const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const request = require('request');
const promisify = require('util').promisify;
// RxJS
const from = require('rxjs').from;
const { map, concatMap } = require('rxjs/operators');

const { SERVER, names } = require('./config');


const getUrl = name => `${SERVER}/${name}-sitemap.xml`;

const retrieve = promisify(request.get);

const parseXmlAndGetUrls = xml => {
	const doc = new dom().parseFromString(xml);

	var nodes = xpath.select('//*[local-name(.)="url"]/*[local-name(.)="loc"]', doc);

	const urls = nodes.map(node => node.textContent);

	return urls;
};

const display = urls => {
	urls.forEach(url => {
		console.log(url);
	});
};

from(names)
	.pipe(
		map(name => getUrl(name)),
		concatMap(url => retrieve(url)),
		map(response => response.body),
		map(xml => parseXmlAndGetUrls(xml)),
		map(urls => display(urls))
	)
	.subscribe();
