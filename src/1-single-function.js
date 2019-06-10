const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const request = require('request');

const { SERVER, names } = require('./config');


function retrieve(name) {
	request.get(`${SERVER}/${name}-sitemap.xml`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			const doc = new dom().parseFromString(body);

			var nodes = xpath.select('//*[local-name(.)="url"]/*[local-name(.)="loc"]', doc);

			const urls = nodes.map(node => node.textContent);

			urls.forEach(url => {
				console.log(url);
			});
		} else {
			console.log(error);
		}
	});
};

names.forEach(name => retrieve(name));
