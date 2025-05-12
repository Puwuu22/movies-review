const express = require('express');
const router = express.Router();
const ReviewsController = require('../controllers/reviews.controller');

// Route for adding a new review
router.post('/review', ReviewsController.apiPostReview);

// Route for updating an existing review
router.put('/review', ReviewsController.apiUpdateReview);

// Route for deleting a review
router.delete('/review', ReviewsController.apiDeleteReview);

module.exports = router; 