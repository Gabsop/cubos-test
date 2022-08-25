import { cardtype, public_Card } from "@prisma/client";
import { prisma } from "./db";

// Create a new card
export async function createCard(
  type: cardtype,
  number: string,
  cvv: string,
  accountId: number
): Promise<public_Card> {
  return prisma.public_Card.create({
    data: {
      type,
      number,
      cvv,
      account_id: accountId,
    },
  });
}

// Get a single card by the card id
export async function getCardByType(
  type: cardtype,
  accountId: number
): Promise<public_Card | null> {
  return prisma.public_Card.findFirst({
    where: {
      type: type,
      account_id: accountId,
    },
  });
}

// Get all cards for a given account
export async function getCards(
  accountId: number,
  itemsPerPage: number,
  currentPage: number
): Promise<public_Card[]> {
  return prisma.public_Card.findMany({
    skip: itemsPerPage * currentPage,
    take: itemsPerPage,
    where: {
      account_id: accountId,
    },
  });
}
