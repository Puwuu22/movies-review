const mongodb = require('mongodb');
const { ObjectId } = mongodb;

let movies;

class MoviesDAO {
    // Khởi tạo, nhận kết nối tới MongoDB
    static async injectDB(connection) {
        if (movies) {
            return; // Nếu đã có rồi thì không cần gán lại
        }
        try {
            // Truy cập database sample_mflix và chọn collections là movies
            movies = await connection.db(process.env.MOVIEREVIEWS_NS).collection('movies');
        } catch (error) {
            console.error(`Unable to connect in MoviesDAO: ${error}`);
        }
    }

    // Lấy danh sách phim
    static async getMovies({
        // destructoring gồm
        filters = null,         // Object chứa các tiêu chí lọc
        page = 0,               // Số trang - dùng trong phân trang
        moviesPerPage = 20,
    } = {}) {
        
        let query;
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters['title'] } };
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } };
            }
        }

        let cursor;
        try {
            cursor = await movies.find(query).limit(moviesPerPage).skip(moviesPerPage * page);
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);

            return {
                moviesList,
                totalNumMovies
            };
        } catch (error) {
            console.error(`Unable to issue find command, ${error}`);
            return { moviesList: [], totalNumMovies: 0 };
        }
    }

    static async getMovieById(movieId) {
        try {
            const movie = await movies.aggregate([
                { $match: { _id: new ObjectId(movieId) } },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "movie_id",
                        as: "reviews"
                    }
                }
            ]).toArray();

            return movie.length > 0 ? movie[0] : null;
        } catch (error) {
            console.error("Error fetching movie by ID: ", error);
        }
    }

    static async getRatings() {
        try {
            const ratings = await movies.aggregate([
                {
                  $project: {
                    id: "$_id",
                    imdbRating: "$imdb.rating",
                    tomatoRating: "$tomatoes.viewer.rating"
                  }
                }
              ]).toArray();
        
              return ratings;
        } catch (error) {
            console.error("Error fetching ratings: ", error);
        }
    }
}

module.exports = MoviesDAO;

