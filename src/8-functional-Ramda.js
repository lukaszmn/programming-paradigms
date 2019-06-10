const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const request = require('request');
const promisify = require('util').promisify;
const R = require('ramda');

const { SERVER, names } = require('./config');


const getUrl = name => `${SERVER}/${name}-sitemap.xml`;

const retrieve = promisify(request.get);

const getBody = R.prop('body');

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

const resolve = promise => Promise.resolve(promise);
const then = fn => pr => pr.then(fn);

const preProcess = R.pipe(
	getUrl,
	retrieve,
	resolve
);
const postProcess = R.pipe(
	getBody,
	parseXmlAndGetUrls,
	display
);

const fullProcess = R.pipe(
	preProcess,
	then(postProcess)
);

/* or simply:
const fullProcess = R.pipe(
	getUrl,
	retrieve,
	resolve,
	then(
		R.pipe(
			getBody,
			parseXmlAndGetUrls,
			display
		)
	)
);
*/

R.forEach(fullProcess)(names);
