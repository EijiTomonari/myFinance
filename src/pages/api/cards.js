import {getSession} from "next-auth/react";
import connectToDatabase from "../../modules/mongodb/mongodb";

export default async (req, res) => {
    switch (req.method) {
        case 'GET':
            return getCards(req, res);
            // case 'POST':
            //     return addCard(req, res);
            // case 'PUT':
            //     return updateCard(req, res);
            // case 'DELETE':
            //     return deleteCard(req, res);
    }
}

const getCards = async (req, res) => {
    const session = await getSession({req})
    try {
        let {db} = await connectToDatabase();
        let cards = await db.collection('cards').find({uid: session.user.id}).toArray();
        return res.json({
            message: JSON.parse(JSON.stringify(cards)),
            success: true
        });
    } catch (error) {
        return res.json({message: new Error(error).message, success: false});
    }
}
