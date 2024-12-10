const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
let db = null;

async function connectToDatabase() {
    try {
        if (!uri) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }

        if (db) {
            console.log('Database already connected.');
            return db;
        }

        console.log('Connecting to database...');
        const client = new MongoClient(uri);
        
        await client.connect();
        db = client.db('pets-db');
        console.log('Connected to database.');
        return db;
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        throw error; // Let the caller handle the error
    }
}

module.exports = { connectToDatabase };