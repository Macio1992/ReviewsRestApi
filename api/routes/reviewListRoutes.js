'use strict';

module.exports = function(app) {
	var reviewList = require('../controllers/reviewListController'),
	userHandlers = require('../controllers/userController.js');

	app.route('/reviews/:pageNumber')
	.get(reviewList.list_all_reviews)

	app.route('/reviews')
		.post(reviewList.create_a_review);
		// .post(userHandlers.loginRequired, reviewList.create_a_review);

	app.route('/reviewSingle/:reviewId')
		.get(reviewList.read_a_review)
		.put(reviewList.update_a_review)
		.delete(reviewList.delete_a_review);

	app.route('/auth/register')
		.post(userHandlers.register);

	app.route('/auth/sign_in')
		.post(userHandlers.sign_in);

	app.route('/auth/get_user_info/:userEmail')
		.get(userHandlers.loginRequired, userHandlers.get_user_info);

	app.route('/upload')
		.post(reviewList.upload_file);

	app.route('/file/:filename')
		.get(reviewList.get_file);
};