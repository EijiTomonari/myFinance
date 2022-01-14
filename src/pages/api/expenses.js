import {getSession} from "next-auth/react";
import connectToDatabase from "../../modules/mongodb/mongodb";

export default async (req, res) => {
    switch (req.method) {
        case 'GET':
            return getExpenses(req, res);
            // case 'POST':
            //     return addCard(req, res);
            // case 'PUT':
            //     return updateCard(req, res);
            // case 'DELETE':
            //     return deleteCard(req, res);
    }
}

const getExpenses = async (req, res) => {
    const session = await getSession({req})
    try {
        let {db} = await connectToDatabase();
        let transactions = await db.collection('transactions').find({uid: session.user.id}).toArray();
        return res.json({
            message: JSON.parse(JSON.stringify(transactions)),
            success: true
        });
    } catch (error) {
        return res.json({message: new Error(error).message, success: false});
    }
}
