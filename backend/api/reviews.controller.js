const ReviewsDAO = require("../dao/reviewsDAO.js")
const { ObjectId } = require("mongodb");

class ReviewsController {
    // Tạo review
    static async apiPostReview(req, res, next) {
        try {
            const { movie_id, review, userInfo } = req.body;
            const { name, _id } = userInfo;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                movie_id,
                review, 
                { name, _id },
                date
            
            )

            res.status(200).json({success: true});

        } catch (error) {
            res.status(500).json({error: "Internal Server Error"});
            console.error("Error creating review: ", error);
        }
    }

    // Sửa review
    static async apiUpdateReview(req, res, next){
        try {
            const { review_id, user_id, review } = req.body;
            const date = new Date();
            
            const reviewResponse = await ReviewsDAO.updateReview(
                review_id,
                user_id,
                review,
                date
            )

            if (reviewResponse.modifiedCount === 0) {
                throw new Error("Unable to update review.");
            }

            res.status(200).json({success: true});
        } catch (error) {
            res.status(500).json({success: false, error: "Internal Server Error"});
        }
    }

    // Xóa review
    static async apiDeleteReview(req, res, next){
        try {
            const { review_id, user_id } = req.body;
            const reviewResponse = ReviewsDAO.deleteReview(
                review_id,
                user_id
            )

            res.status(200).json({success: true});
        } catch (error) {
            res.status(500).json({success: false, error: "Internal Server Error"});
        }
    }
}
module.exports = ReviewsController;

