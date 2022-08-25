import { public_Account, transactiontype } from "@prisma/client";
import { prisma } from "./db";

// Create a new account
export async function createAccount(
  branch: string,
  account: string,
  peopleId: number
): Promise<public_Account> {
  return prisma.public_Account.create({
    data: {
      branch,
      account,
      people_id: peopleId,
    },
  });
}

// Get a single account by the account id
export async function getAccount(
  accountId: number
): Promise<public_Account | null> {
  return prisma.public_Account.findUnique({
    where: {
      id: accountId,
    },
  });
}

// Get all accounts for a given people
export async function getAccounts(peopleId: number): Promise<public_Account[]> {
  return prisma.public_Account.findMany({
    where: {
      people_id: peopleId,
    },
  });
}

// Change the balance of an account
export async function changeBalance(
  value: number | undefined,
  type: transactiontype,
  accountId: number
): Promise<public_Account> {
  var balance = {};

  if (type === "debit") {
    balance = {
      decrement: value,
    };
  } else {
    balance = {
      increment: value,
    };
  }

  return prisma.public_Account.update({
    where: {
      id: accountId,
    },
    data: {
      balance,
    },
  });
}
