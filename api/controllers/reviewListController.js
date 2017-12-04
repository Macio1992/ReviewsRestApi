'use strict';

let mongoose = require('mongoose')
let Review = mongoose.model('Reviews');
let config = require('../../config/config');
require('../../config/mongoose.config')(config);
let conn = mongoose.connection;
let multer = require('multer');
let GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
let gfs = Grid(conn.db);

let storage = GridFsStorage({
	gfs : gfs,
	filename: function (req, file, cb) {
		var datetimestamp = Date.now();
		// cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
		cb(null, file.originalname);
	},
	metadata: function(req, file, cb) {
		cb(null, { originalname: file.originalname });
	},
	root: 'ctFiles'
});

let upload = multer({
	storage: storage
}).single('file');

exports.list_all_reviews = function(req, res) {

	let perPage = 10;
	let page = Math.max(0, req.params.pageNumber-1);
	let isLastPage;

	Review.find().limit(perPage).skip(perPage * page).sort({ title: 'asc'}).exec((err, reviews) => {
		Review.count().exec((err, count) => {
			if(err) {
				res.send(err);
			} else {
				isLastPage = (page+1) === (count/perPage) ? true : false;
				res.json({reviews: reviews, page: page, pages: count / perPage, isLastPage: isLastPage})
			}
		});
	});
};

exports.create_a_review = function(req, res) {
	let new_review = new Review(req.body);
	new_review.save(function(err, review) {
		if(err){
			res.send(err);
		} else {
			res.json(review);
		}
	});
};

exports.read_a_review = function(req, res) {
	Review.findById(req.params.reviewId, function(err, review) {
		if (err) {
			res.send(err);
		} else {
			res.json(review);
		}
	});
};

exports.update_a_review = function(req, res) {
	Review.findOneAndUpdate({_id:req.params.reviewId}, req.body, {new: true}, function(err, review) {
		if (err){
			res.send(err);
		} else {
			res.json(review);
		}
	});
};

exports.delete_a_review = function(req, res) {
	Review.remove({
		_id: req.params.reviewId
	}, function(err, review) {
		if (err) {
			res.send(err);
		} else {
			res.json({ message: 'Review successfully deleted' });
		}
	});
};

exports.upload_file = function(req, res){
	upload(req,res,function(err){
		if(err){
			 res.json({error_code:1,err_desc:err});
			 return;
		}
		 res.json({error_code:0,err_desc:null});
	});
}

exports.get_file = function(req, res){
	gfs.collection('ctFiles');
	
	gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
		if(!files || files.length === 0){
			return res.status(404).json({
				responseCode: 1,
				responseMessage: "error"
			});
		}
		var readstream = gfs.createReadStream({
			filename: files[0].filename,
			root: "ctFiles"
		});
		res.set('Content-Type', files[0].contentType)
		return readstream.pipe(res);
	});
}