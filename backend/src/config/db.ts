import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const uri: string = process.env.MONGO_URI as string; // Ensure your .env file contains MONGO_URI
const dbName: string = process.env.DB_NAME as string; // Ensure your .env file contains DB_NAME
const client = new MongoClient(uri);

let dbConnection: MongoClient;

const connectDB = async () => {
    try {
        // Connect the client to the server (and therefore to the database)
        await client.connect();
        console.log("Successfully connected to MongoDB Atlas.");

        // Assign the connection to dbConnection
        dbConnection = client;
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas:', error);
        process.exit(1);
    }
};

const getDB = () => {
    if (!dbConnection) {
        throw new Error('No database connection');
    }
    return dbConnection.db(dbName); // Use the DB_NAME from environment variables
};

// Optional: Close the connection
const closeDB = async () => {
    await dbConnection.close();
};

export { connectDB, getDB, closeDB };
