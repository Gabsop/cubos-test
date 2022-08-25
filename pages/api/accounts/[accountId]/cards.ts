import { cardtype, public_Account, public_Card } from "@prisma/client";
import { getAccount } from "../../../db/accounts";
import { createCard, getCardByType, getCards } from "../../../db/cards";

const cards = async (
  req: {
    query: { itemsPerPage?: string; currentPage?: string; accountId?: string };
    method: string;
    body: { type: cardtype; number: string; cvv: string };
  },
  res: {
    json: (arg0: {
      id: number | undefined;
      branch?: string | undefined;
      account?: string | undefined;
      cards?: {
        id: number;
        type: cardtype;
        number: string;
        cvv: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
      createdAt: Date | undefined;
      updatedAt: Date | undefined;
      pagination?: { itemsPerPage: number; currentPage: number };
      type?: cardtype;
      number?: string;
      cvv?: string;
    }) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      send: { (arg0: string): void; new (): any };
    };
  }
): Promise<void> => {
  const { accountId } = req.query;

  // Checking if itemsPerPage and currentPage exists in the query, if not, setting default values
  var itemsPerPage = req.query.itemsPerPage
    ? Number(req.query.itemsPerPage)
    : 5;
  var currentPage = req.query.currentPage ? Number(req.query.currentPage) : 1;

  switch (req.method) {
    case "GET":
      var account: public_Account | null = await getAccount(Number(accountId));
      const cards: public_Card[] | null = await getCards(
        Number(accountId),
        itemsPerPage,
        currentPage - 1 // Doing -1 here because I want the first page to be 1 and not 0
      );

      res.json({
        id: account?.id,
        branch: account?.branch,
        account: account?.account,
        cards: cards.map((card) => ({
          id: card.id,
          type: card.type,
          number: card.number.replace(/(.*)([0-9]{4})$/gm, "**** **** **** $2"), // Returning only the last 4 digits of the card number
          cvv: card.cvv,
          createdAt: card.created_at,
          updatedAt: card.updated_at,
        })),
        createdAt: account?.created_at,
        updatedAt: account?.updated_at,
        pagination: {
          itemsPerPage,
          currentPage: currentPage,
        },
      });

      break;

    case "POST":
      const { type, number, cvv } = req.body;

      // Checking if the account exists
      var account: public_Account | null = await getAccount(Number(accountId));
      if (account === null) {
        res.status(400).send("Account not found!");
      }

      if (type === "physical") {
        let card: public_Card | null = await getCardByType(
          "physical",
          Number(accountId)
        );
        if (card) {
          res.status(400).send("Only one physical card allowed per account!");
          return;
        }
      }

      const card: public_Card = await createCard(
        type,
        number,
        cvv,
        Number(accountId)
      );

      res.json({
        id: card.id,
        type: card.type,
        number: card.number.replace(/(.*)([0-9]{4})$/gm, "**** **** **** $2"),
        cvv: card.cvv,
        createdAt: card.created_at,
        updatedAt: card.updated_at,
      });

      break;

    default:
      res.status(405).send("Method Not Allowed");
      break;
  }
};

export default cards;
