"use strict";
let mongoose = require('mongoose');
let Review = require('../api/models/reviewListModel');
let Category = require('../api/models/categoryModel');
let dimsum = require('dimsum');
mongoose.Promise = global.Promise;

module.exports = (config) => {
let dbURI = config.dev.db;

	mongoose.connect(dbURI, {
		useMongoClient: true,
	}).then(() => {
		console.log(`Connected to ${dbURI}`);
	}).catch((e) => {
		throw e;
	});

	mongoose.connection.on('connected', (req, res) => {

		let categories = require('./categories.json');
		let reviews = require('./reviews.json');

		// Category.remove((err) => {
		// 	console.log('categories removed');
		// 	Category.collection.insertMany(categories, (err) => {
		// 		console.log('categories added');
		// 	});
		// });

		Review.remove((err) => {
			console.log('reviews removed');
			Review.collection.insertMany(reviews, (err) => {
				if(err) throw err;
				console.log('reviews added');
			});
		});

	});
};