const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const request = require('request');
const promisify = require('util').promisify;

const { SERVER, names } = require('./config');


const retrieve = promisify(request.get);
const getUrl = name => `${SERVER}/${name}-sitemap.xml`;

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

names.forEach(name => {
	retrieve(getUrl(name))
		.then(response => {
			const xml = response.body;
			const urls = parseXmlAndGetUrls(xml);
			display(urls);
		});
});
