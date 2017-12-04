'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  title: {
    type: String,
    Required: 'Kindly enter the name of the review'
  },
  content: {
    type: String
  },
  image: {
    type: String,
    default: ''
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  }
});


module.exports = mongoose.model('Reviews', ReviewSchema);