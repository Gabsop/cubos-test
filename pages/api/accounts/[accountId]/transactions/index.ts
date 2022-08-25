import {
  public_Account,
  public_Transaction,
  transactiontype,
} from "@prisma/client";
import { changeBalance, getAccount } from "../../../../../db/accounts";
import {
  createTransaction,
  getTransactions,
} from "../../../../../db/transactions";

const transactions = async (
  req: {
    query: {
      itemsPerPage?: string;
      currentPage?: string;
      accountId?: string;
      startDate?: string;
      endDate?: string;
    };
    method: string;
    body: { value: number; description: string; type: transactiontype };
  },
  res: {
    json: (arg0: {
      transactions?:
        | {
            id: number;
            value: number;
            type: transactiontype;
            description: string;
            createdAt: Date;
            updatedAt: Date;
          }[]
        | undefined;
      pagination?: { itemsPerPage: number; currentPage: number };
      id?: number;
      value?: number;
      type?: transactiontype;
      description?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: string): void; new (): any };
    };
  }
) => {
  const { accountId } = req.query;

  // Checking if itemsPerPage, currentPage, startDate and endDate exists in the query, if not, setting default values
  var itemsPerPage = req.query.itemsPerPage
    ? Number(req.query.itemsPerPage)
    : 5;
  var currentPage = req.query.currentPage ? Number(req.query.currentPage) : 1;
  var startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : undefined;
  var endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;

  switch (req.method) {
    case "GET":
      const transactions: public_Transaction[] | null = await getTransactions(
        Number(accountId),
        itemsPerPage,
        currentPage - 1, // Doing -1 here because I want the first page to be 1 and not 0
        startDate,
        endDate
      );
      res.json({
        transactions: transactions?.map((transaction) => ({
          id: transaction.id,
          value: transaction.value,
          type: transaction.type,
          description: transaction.description,
          createdAt: transaction.created_at,
          updatedAt: transaction.updated_at,
        })),
        pagination: {
          itemsPerPage,
          currentPage: currentPage,
        },
      });
      break;

    case "POST":
      const { value, description, type } = req.body;
      const account: public_Account | null = await getAccount(
        Number(accountId)
      );

      // Checking if the balance is sufficient to make the transaction
      if (type === "debit") {
        if (account!.balance < value) {
          res
            .status(400)
            .send("Insufficient funds! \n Balance: " + account!.balance);
        }
      }

      const transaction = await createTransaction(
        value,
        description,
        type,
        Number(accountId)
      );
      res.json({
        id: transaction.id,
        value: transaction.value,
        type: transaction.type,
        description: transaction.description,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      });

      await changeBalance(Number(value), type, Number(accountId));

      break;

    default:
      res.status(405).send("Method Not Allowed");
      break;
  }
};

export default transactions;
