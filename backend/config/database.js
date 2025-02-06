const mongoose = require('mongoose');

exports.connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "SocialApp" // Explicitly specify the database name
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit process on failure
    }
};


