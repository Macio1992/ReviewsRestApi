'use strict';

var mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcrypt'),
	User = mongoose.model('User');

exports.register = function(req, res) {

	User.findOne({
		email: req.body.email
	}, (err, user) => {
		if(err) throw err;
		if(user){
			res.status(500).send({message: 'EMAIL_TAKEN'});
		}
		if(!user){
			var newUser = new User(req.body);
			newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
			newUser.save(function(err, user) {
				if (err) {
					return res.status(400).send({
						message: err
					});
				} else {
					user.hash_password = undefined;
					return res.json(user);
				}
			});
		}
	})
	
	
};

exports.sign_in = function(req, res) {
	User.findOne({
		email: req.body.email
	}, function(err, user) {
		if (err) throw err;
		if (!user || !user.comparePassword(req.body.password)) {
			return res.status(401).json({ message: 'INVALID_PASSWORD_OR_EMAIL' });
		}
		
		return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
	});
};

exports.loginRequired = function(req, res, next) {
	if (req.user) {
		next();
	} else {
		return res.status(401).json({ message: 'Unauthorized user!' });
	}
};

exports.get_user_info = function(req, res){
	User.findOne({
		email: req.params.userEmail
	}, (err, user) => {
		if(err) throw err;
		if(user){
			res.json(user);
		}
	})
};