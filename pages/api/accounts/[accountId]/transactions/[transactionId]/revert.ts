import { public_Transaction } from "@prisma/client";
import { changeBalance } from "../../../../../../db/accounts";
import {
  createTransaction,
  getTransaction,
} from "../../../../../../db/transactions";

const revert = async (
  req: {
    query: { accountId: string; transactionId: string };
    body: { description: string };
    method: string;
  },
  res: {
    json: (arg0: {
      id: number;
      value: number;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    }) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: string): void; new (): any };
    };
  }
) => {
  const { accountId, transactionId } = req.query;
  const { description } = req.body;

  switch (req.method) {
    case "POST":
      const transaction: public_Transaction | null = await getTransaction(
        Number(transactionId)
      );
      var newTransaction: public_Transaction = {
        id: 0,
        value: 0,
        description: "",
        type: "debit",
        account_id: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
      var value = transaction?.value;

      // Checks the type of the transaction and changes the balance accordingly
      if (transaction?.type === "debit") {
        newTransaction = await createTransaction(
          transaction.value,
          description,
          "credit",
          Number(accountId)
        );
        await changeBalance(value, "credit", Number(accountId));
      } else {
        newTransaction = await createTransaction(
          transaction!.value,
          description,
          "debit",
          Number(accountId)
        );
        await changeBalance(value, "debit", Number(accountId));
      }

      res.json({
        id: newTransaction?.id,
        value: newTransaction?.value,
        description: newTransaction?.description,
        createdAt: newTransaction?.created_at,
        updatedAt: newTransaction?.updated_at,
      });
      break;

    default:
      res.status(405).send("Method Not Allowed");
      break;
  }
};

export default revert;
