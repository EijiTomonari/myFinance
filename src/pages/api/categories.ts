import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import connectToDatabase from "../../modules/mongodb/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.json({ message: "Error! Not authenticated" });
  }

  switch (req.method) {
    case "GET":
      return fetchCategories(res, session);
  }
};

const fetchCategories = async (res: NextApiResponse, session: Session) => {
  try {
    const { db } = await connectToDatabase();
    const categories = await db
      .collection("categories")
      .find({
        uid: session!.user!.id,
      })
      .toArray();
    return res.json({
      message: JSON.parse(JSON.stringify(categories)),
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error as string).message,
      success: false,
    });
  }
};

export default handler;
