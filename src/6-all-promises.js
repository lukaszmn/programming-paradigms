const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const request = require('request');

const { SERVER, names } = require('./config');


const retrieve = name => new Promise(function(resolve, reject) {
	request.get(`${SERVER}/${name}-sitemap.xml`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			resolve(body);
		} else {
			reject(error);
		}
	});
});

const parseXmlAndGetUrls = xml => new Promise(function(resolve, reject) {
	const doc = new dom().parseFromString(xml);

	var nodes = xpath.select('//*[local-name(.)="url"]/*[local-name(.)="loc"]', doc);

	const urls = nodes.map(node => node.textContent);

	resolve(urls);
});

const display = arr => new Promise(function(resolve, reject) {
	arr.forEach(line => console.log(line));
	resolve();
});

names.forEach(name => {
	retrieve(name)
		.then(xml => parseXmlAndGetUrls(xml))
		.then(urls => display(urls));
});
