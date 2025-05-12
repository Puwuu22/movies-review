const dotenv = require('dotenv');
const app = require('./server.js');
const mongodb = require('mongodb');
const MoviesDAO = require('./dao/moviesDAO.js');
const ReviewsDAO = require('./dao/reviewsDAO.js')
dotenv.config();

async function main() {
    const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);
    const PORT = process.env.PORT || 3000;

    try {
        console.log("Attempting to connect to MongoDB...");
        // Connect to MongoDB Cluster
        await client.connect();
        console.log("✅ MongoDB connection successful");

        await MoviesDAO.injectDB(client);
        console.log("✔️  MoviesDAO initialized");

        await ReviewsDAO.injectDB(client);
        console.log("☑️  ReviewsDAO initialized");

        app.listen(PORT, () => {
            console.log("Server is running on port:", PORT);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

main().catch(console.error);

module.exports = main;