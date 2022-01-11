import connectToDatabase from '../../lib/mongodb';
import {ObjectId} from 'mongodb';

export default async function (req, res) { // switch the methods
    switch (req.method) {
        case 'GET':
            {
                return getTransactions(req, res);
            }

        case 'POST':
            {
                return addTransaction(req, res);
            }

        case 'PUT':
            {
                return updateTransaction(req, res);
            }

        case 'DELETE':
            {
                return deleteTransaction(req, res);
            }
    }
}

const getTransactions = async (req, res) => {
    const {db} = await connectToDatabase(req);
    const transactions = await db.collection('transactions').find({}).toArray();
    res.json(transactions);
};

const addTransaction = async (req, res) => {
    try {
        const {db} = await connectToDatabase(req);
        // add the post
        await db.collection('transactions').insertOne(JSON.parse(req.body));
        // return a message
        return res.json({message: 'Transaction added successfully', success: true});
    } catch (error) { // return an error
        return res.json({message: new Error(error).message, success: false});
    }
}

const updateTransaction = async (req, res) => {
    try {
        const {db} = await connectToDatabase(req);

        let body = JSON.parse(req.body)
        // update the published status of the post
        const result = await db.collection('transactions').updateOne({
            _id: ObjectId(body._id)
        }, {
            $set: {
                category: body.category
            }
        })
        // return a message
        return res.json({message: 'Transaction updated successfully', success: true});
    } catch (error) { // return an error
        return res.json({message: new Error(error).message, success: false});
    }
}

const deleteTransaction = async (req, res) => {
    try { // Connecting to the database
        const {db} = await connectToDatabase(req);

        // Deleting the post
        let body = JSON.parse(req.body)
        const document = await db.collection('transactions').findOne({_id: ObjectId("61dc5869055e6e1fc2c81284")})

        const result = await db.collection('transactions').deleteOne({
            _id: ObjectId(body._id)
        });

        // returning a message
        return res.json({message: 'Post deleted successfully', success: true});
    } catch (error) { // returning an error
        return res.json({message: new Error(error).message, success: false});
    }
}
