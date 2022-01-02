import connectToDatabase  from '../../lib/mongodb';

export default async (req, res) => {
    const { db } = await connectToDatabase(req);
    const transactions = await db
      .collection('transactions')
      .find({})
      .toArray();
    res.json(transactions);
  };