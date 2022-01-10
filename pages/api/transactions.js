import connectToDatabase from '../../lib/mongodb';

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
