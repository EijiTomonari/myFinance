import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';

async function handler(req, res) {

    //Only POST method is accepted
    if (req.method === 'POST') {
        //Getting email and password from body
        const { email, password } = req.body;
        //Validate
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ message: 'Invalid Data' });
            return;
        }
        //Connect with database\
        const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.h7j1y.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
        const client = await MongoClient.connect(uri, { useNewUrlParser: true })
            .catch(err => { console.log(err); });
        if (!client) {
            return;
        }
        try {


            const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_USERS);

            const checkExisting = await collection.findOne({ email: email });

            if (checkExisting) {
                res.status(422).json({ message: 'User already exists' });
                client.close();
                return;
            }

            //Hash password
            const status = await collection.insertOne({
                email,
                password: await hash(password, 12),
            });
            //Send success response
            res.status(201).json({ message: 'User created', ...status });
            //Close DB connection
            client.close();

        } catch (err) {

            console.log(err);
        } finally {

            client.close();
        }

    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Route not valid' });
    }
}

export default handler;