import { public_Transaction, transactiontype } from "@prisma/client";
import { prisma } from "./db";

export async function createTransaction(
  value: number,
  description: string,
  type: transactiontype,
  accountId: number
): Promise<public_Transaction> {
  return prisma.public_Transaction.create({
    data: {
      value,
      description,
      type,
      account_id: accountId,
    },
  });
}

// Get a single transaction by the transaction id
export async function getTransaction(
  transactionId: number
): Promise<public_Transaction | null> {
  return prisma.public_Transaction.findUnique({
    where: {
      id: transactionId,
    },
  });
}

// Get all transactions for a given account with pagination and date range
export async function getTransactions(
  accountId: number,
  itemsPerPage: number,
  currentPage: number,
  beginDate?: Date,
  endDate?: Date
): Promise<public_Transaction[] | null> {
  // Date filter

  if (beginDate && endDate) {
    const date = {
      lt: endDate,
      gte: beginDate,
    };
    return prisma.public_Transaction.findMany({
      skip: itemsPerPage * currentPage,
      take: itemsPerPage,
      where: {
        account_id: accountId,
        created_at: date,
      },
    });
  }

  return prisma.public_Transaction.findMany({
    skip: itemsPerPage * currentPage,
    take: itemsPerPage,
    where: {
      account_id: accountId,
    },
  });
}
