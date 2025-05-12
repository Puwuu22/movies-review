const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

let reviews;

class ReviewsDAO {
    static async injectDB(conn) {
        if(reviews) {
            return;  // Nếu đã có rồi thì không cần gán lại
        }

        try {
            reviews = await conn.db("sample_mflix").collection("reviews");
            console.log("Connected to reviews collection.");
        } catch (error) {
            console.error(`Unable to connect in ReviewsDAO: ${error}`);
        }
    }

    static async addReview(movieId, review, userInfo, date) {
        try {   
            const reviewDoc = {
                movie_id: new ObjectId(movieId),
                review: review,
                userInfo: {
                    name: userInfo.name,
                    _id: userInfo._id
                },
                date: date
            }

            return await reviews.insertOne(reviewDoc);
        } catch (error) {
            console.error(`Unable to post review: ${error}`);
        }
    }

    static async updateReview(reviewId, userId, updateReview, date) {
        try {
            const updateResponse = await reviews.updateOne(
                {
                    _id: new ObjectId(reviewId),
                    "userInfo._id": userId
                },
                {
                    $set: {
                        review: updateReview,
                        date: date
                    }
                }
            )

            return updateResponse;

        } catch (error) {
            console.error(`Unable to update review: ${error}`);
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
                "userInfo._id": userId
            });

            return deleteResponse;
        } catch (error) {
            console.error(`Unable to delete review: ${error}`);
        }
    }
    
}

module.exports = ReviewsDAO;