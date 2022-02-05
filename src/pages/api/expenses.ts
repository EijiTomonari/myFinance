import { ErrorDescription } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { totalmem } from "os";
import connectToDatabase from "../../modules/mongodb/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.json({
      message: new Error("Not signed in").message,
      success: false,
    });
  }
  switch (req.method) {
    case "GET":
      return getExpenses(req, res, session);
    // case 'POST':
    //     return addCard(req, res);
    // case 'PUT':
    //     return updateCard(req, res);
    // case 'DELETE':
    //     return deleteCard(req, res);
  }
};

const getExpenses = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  try {
    const { db } = await connectToDatabase();
    const initialdate = new Date((req.query.initialdate as string) + "-01");
    const finaldate = new Date((req.query.initialdate as string) + "-01");
    finaldate.setMonth(finaldate.getMonth() + 1);
    const expenses = await db.collection("transactions").aggregate([
      {
        $facet: {
          totalexpenses: [
            {
              $match: {
                uid: session!.user!.id,
                date: {
                  $gte: new Date(initialdate.toISOString()),
                  $lt: new Date(finaldate.toISOString()),
                },
              },
            },
            {
              $group: {
                _id: "",
                value: {
                  $sum: "$value",
                },
              },
            },
          ],
          thirdpartyexpenses: [
            {
              $match: {
                uid: session!.user!.id,
                date: {
                  $gte: new Date(initialdate.toISOString()),
                  $lt: new Date(finaldate.toISOString()),
                },
                thirdparty: true,
              },
            },
            {
              $group: {
                _id: "",
                value: {
                  $sum: "$value",
                },
              },
            },
          ],
          nextmonthinstallments: [
            {
              $match: {
                uid: session!.user!.id,
                date: {
                  $gte: new Date(initialdate.toISOString()),
                  $lt: new Date(finaldate.toISOString()),
                },
                $expr: { $gt: ["$installments", "$installment"] },
              },
            },
            {
              $group: {
                _id: "",
                value: {
                  $sum: "$value",
                },
              },
            },
          ],
          expensespercategory: [
            {
              $match: {
                uid: session!.user!.id,
                date: {
                  $gte: new Date(initialdate.toISOString()),
                  $lt: new Date(finaldate.toISOString()),
                },
              },
            },
            { $group: { _id: "$category", value: { $sum: "$value" } } },
          ],
        },
      },
    ]);
    for await (const doc of expenses) {
      return res.json({
        message: JSON.parse(JSON.stringify(doc)),
        success: true,
      });
    }
  } catch (error) {
    return res.json({
      message: new Error(error as string).message,
      success: false,
    });
  }
};

export default handler;
