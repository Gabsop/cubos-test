import { public_Account } from "@prisma/client";
import { createAccount, getAccounts } from "../../../db/accounts";

const accounts = async (
  req: {
    query: { peopleId: string };
    method: string;
    body: { branch: string; account: string };
  },
  res: {
    json: (
      arg0:
        | {
            id: number;
            branch: string;
            account: string;
            createdAt: Date;
            updatedAt: Date;
          }[]
        | {
            id: number;
            branch: string;
            account: string;
            createdAt: Date;
            updatedAt: Date;
          }
    ) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: string): void; new (): any };
    };
  }
) => {
  const { peopleId } = req.query;

  switch (req.method) {
    case "GET":
      const accounts: public_Account[] = await getAccounts(Number(peopleId));
      res.json(
        accounts.map((account) => ({
          id: account.id,
          branch: account.branch,
          account: account.account,
          createdAt: account.created_at,
          updatedAt: account.updated_at,
        }))
      );
      break;

    case "POST":
      const { branch, account } = req.body;
      const accountResponse: public_Account = await createAccount(
        branch,
        account,
        Number(peopleId)
      );
      res.json({
        id: accountResponse.id,
        branch: accountResponse.branch,
        account: accountResponse.account,
        createdAt: accountResponse.created_at,
        updatedAt: accountResponse.updated_at,
      });
      break;

    default:
      res.status(405).send("Method Not Allowed");
      break;
  }
};

export default accounts;
