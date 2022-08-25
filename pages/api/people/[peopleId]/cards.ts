import { getAccounts } from "../../../db/accounts";
import { getCards } from "../../../db/cards";
import { cardtype, public_Card } from "@prisma/client";

export default async function Get(
  req: {
    query: { itemsPerPage?: string; currentPage?: string; peopleId?: string };
  },
  res: {
    json: (arg0: {
      cards: {
        id: number;
        type: cardtype;
        number: string;
        cvv: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
      pagination: { itemsPerPage: number; currentPage: number };
    }) => void;
  }
) {
  const { peopleId } = req.query;
  const accounts = await getAccounts(Number(peopleId));
  const cards: public_Card[] = [];

  // Checking if itemsPerPage and currentPage exist in the query, if not, setting default values
  var itemsPerPage = req.query.itemsPerPage
    ? Number(req.query.itemsPerPage)
    : 5;
  var currentPage = req.query.currentPage ? Number(req.query.currentPage) : 1;

  // Getting the cards for each account of this person
  for await (const account of accounts) {
    let card: public_Card[] = await getCards(
      account.id,
      itemsPerPage,
      currentPage - 1
    ); // Doing -1 here because I want the first page to be 1 and not 0
    cards.push(...card);
  }
  res.json({
    cards: cards.map((card) => ({
      id: card.id,
      type: card.type,
      number: card.number.replace(/(.*)([0-9]{4})$/gm, "**** **** **** $2"),
      cvv: card.cvv,
      createdAt: card.created_at,
      updatedAt: card.updated_at,
    })),
    pagination: {
      itemsPerPage,
      currentPage: currentPage,
    },
  });
}
