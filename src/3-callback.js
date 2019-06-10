const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const request = require('request');

const { SERVER, names } = require('./config');


const retrieve = (name, callback) => {
	request.get(`${SERVER}/${name}-sitemap.xml`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(body);
		}
	});
};

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

const process = body => {
	const urls = parseXmlAndGetUrls(body);
	display(urls);
};

names.forEach(name => retrieve(name, process));
