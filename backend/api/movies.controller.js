const MoviesDAO = require('../dao/moviesDAO.js');
class MoviesController {
    static async apiGetMovies(req, res, next) {
        
        // Kiểm tra và lấy tham số moviesPerPage từ URL, mặc định là 20 nếu không có
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20;

        // Lấy tham số page từ URL, mặc ssịnh là 0 (trang đầu tiên) nếu không có
        const page = req.query.page ? parseInt(req.query.page) : 0;
        
        let filters = {};
        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.title = req.query.title;
        }
        // Gọi DAO để lấy dữ liệu
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters,
            page,
            moviesPerPage
        });

        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies
        };

        res.json(response);
    }

    static async apiGetMovieById(req, res, next) {
        try {
            const { movieId } = req.params;
            const movie = await MoviesDAO.getMovieById(movieId);

            if(!movie) {
                return res.status(404).json({error: "Movie not found"});
            }

            res.status(200).json({success: true, data: movie})
        } catch (error) {
            res.status(500).json({error: "Internal Server Error"});
            console.error("Error getting movie by Id: ", error)
        }
    }

    static async apiGetRatings(req, res, next){
        try {
            const ratings = await MoviesDAO.getRatings();
            res.status(200).json({success: true, rating: ratings});
        } catch (error) {
            res.status(500).json({error: "Internal Server Error"});
            console.error("Error getting ratings: ", error);
        }
    }
}
module.exports = MoviesController;

