import {MongoClient} from 'mongodb';
import { getSession } from "next-auth/react"

let cachedClient = null;
let cachedDb = null;

const connectToDatabase = async (req, res) => {
    const session = await getSession({req});
    const USER_NAME_DB = session ?. user ?. email ?. substring(0, session.user.email.indexOf("@"));
    const MONGODB_URI = `mongodb+srv://${
        process.env.MONGO_USER
    }:${
        process.env.MONGO_PASS
    }@${
        process.env.MONGO_CLUSTER
    }.h7j1y.mongodb.net/${USER_NAME_DB}?retryWrites=true&w=majority`;
    // check the cached.
    if (cachedClient && cachedDb) { // load from cache
        return {client: cachedClient, db: cachedDb};
    }

    // set the connection options
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    // Connect to cluster
    let client = new MongoClient(MONGODB_URI, opts);
    await client.connect();
    let db = client.db(USER_NAME_DB);

    // set cache
    cachedClient = client;
    cachedDb = db;

    return {client: cachedClient, db: cachedDb};
}

export default connectToDatabase;
