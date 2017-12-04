'use strict';

module.exports = function(app){

    var categoriesContr = require('../controllers/categoriesController');

    app.route('/categories')
    .get(categoriesContr.list_all_categories);

    app.route('/categories/:cat_id')
    .get(categoriesContr.get_single_category);

}