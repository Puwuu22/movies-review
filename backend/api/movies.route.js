const express = require('express');
const MoviesController = require('./movies.controller.js');
const ReviewsController = require('./reviews.controller.js');

const router = express.Router();

router.route('/').get(MoviesController.apiGetMovies);
router.route('/reviews')
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview);

router.route('/ratings').get(MoviesController.apiGetRatings);
router.route('/:movieId').get(MoviesController.apiGetMovieById);

module.exports = router;

