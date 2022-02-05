import {MongoClient} from 'mongodb';

let cachedClient = null;
let cachedDb = null;

const connectToDatabase = async () => {
    const { MONGODB_URI, MONGODB_DB } = process.env;
    
    // Checl the cached.
    if (cachedClient && cachedDb) { // load from cache
        return {client: cachedClient, db: cachedDb};
    }
    // Set the connection options
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    // Connect to cluster
    let client = new MongoClient(MONGODB_URI, opts);
    await client.connect();
    let db = client.db(MONGODB_DB);

    // set cache
    cachedClient = client;
    cachedDb = db;

    return {client: cachedClient, db: cachedDb};
}

export default connectToDatabase;
