const express = require('express');
const cors = require('cors');
const movies = require('./api/movies.route.js')

// Init express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.use('/api/v1/movies', movies);

// Xử lý lỗi 404 nếu không có route nào khớp
app.use((req, res) => {
    res.status(404).send("404 Page not found");
})

// Export app
module.exports = app;

