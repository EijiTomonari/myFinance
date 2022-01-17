import {getSession} from "next-auth/react";
import connectToDatabase from "../../modules/mongodb/mongodb";
import type {NextApiRequest, NextApiResponse}
from 'next'
import {Session} from "next-auth";

export default async (req : NextApiRequest, res : NextApiResponse) => {
    const session = await getSession({req})

    if (! session) {
        return res.json({message: 'error'})
    }

    switch (req.method) {
        case 'GET':
            return getCards(req, res, session);
            // case 'POST':
            //     return addCard(req, res);
            // case 'PUT':
            //     return updateCard(req, res);
            // case 'DELETE':
            //     return deleteCard(req, res);
    }
}

const getCards = async (req : NextApiRequest, res : NextApiResponse, session : Session) => {
    try {
        const {db} = await connectToDatabase();
        const cards = await db.collection('cards').find({
            uid: session !.user !.id
        }).toArray();
        return res.json({
            message: JSON.parse(JSON.stringify(cards)),
            success: true
        });
    } catch (error) {
        return res.json({
            message: new Error(error as string).message,
            success: false
        });
    }
}
