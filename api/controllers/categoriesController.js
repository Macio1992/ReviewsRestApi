'use strict';

let mongoose = require('mongoose');
let Category = require('../models/categoryModel');

exports.list_all_categories = function(req, res){
    
    Category.find((err, categories) => {
        if(err){
            res.send(err);
        } else {
            res.json(categories);
        }
    });
};

exports.get_single_category = function(req, res){

    Category.findById(req.params.cat_id, function(err, category) {
		if (err) {
			res.send(err);
		} else {
			res.json(category);
		}
	});

}