import connectToDatabase from '../../modules/mongodb/mongodb'
import {ObjectId} from 'mongodb';
import {getSession} from "next-auth/react"

export default async function (req, res) { // switch the methods
    switch (req.method) {
        case 'GET':
            return getTransactions(req, res);
        case 'POST':
            return addTransaction(req, res);
        case 'PUT':
            return updateTransaction(req, res);
        case 'DELETE':
            return deleteTransaction(req, res);
    }
}

const getTransactions = async (req, res) => {
    const session = await getSession({req})
    try { // connect to the database
        let {db} = await connectToDatabase();
        // fetch the posts
        let size = await db.collection('transactions').count()

        let transactions = await db.collection('transactions').find({uid:session.user.id}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray();
        // return the transactions
        return res.json({
            message: JSON.parse(JSON.stringify(transactions)),
            success: true,
            size: size
        });
    } catch (error) { // return the error
        return res.json({message: new Error(error).message, success: false});
    }
}

const addTransaction = async (req, res) => {
    try {
        const {db} = await connectToDatabase();
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
        const {db} = await connectToDatabase();

        let body = JSON.parse(req.body)
        let fields = {
            ... body
        }
        delete fields["_id"]
        // update the published status of the post
        const result = await db.collection('transactions').updateOne({
            _id: ObjectId(body._id)
        }, {$set: fields})
        // return a message
        return res.json({message: 'Transaction updated successfully', success: true});
    } catch (error) { // return an error
        return res.json({message: new Error(error).message, success: false});
    }
}

const deleteTransaction = async (req, res) => {
    try { // Connecting to the database
        const {db} = await connectToDatabase();

        // Deleting the post
        let body = JSON.parse(req.body)

        const result = await db.collection('transactions').deleteOne({
            _id: ObjectId(body._id)
        });

        // returning a message
        return res.json({message: 'Post deleted successfully', success: true});
    } catch (error) { // returning an error
        return res.json({message: new Error(error).message, success: false});
    }
}
