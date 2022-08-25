import { public_Account } from "@prisma/client";
import { getAccount } from "../../../db/accounts";

const balance = async (
  req: { query: { accountId: string }; method: string },
  res: {
    json: (arg0: { balance: number | undefined }) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: string): void; new (): any };
    };
  }
): Promise<void> => {
  const { accountId } = req.query;

  switch (req.method) {
    case "GET":
      const account: public_Account | null = await getAccount(
        Number(accountId)
      );
      res.json({
        balance: account?.balance,
      });
      break;

    default:
      res.status(405).send("Method Not Allowed");
      break;
  }
};

export default balance;
