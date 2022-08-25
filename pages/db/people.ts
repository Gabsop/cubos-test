import { public_People } from "@prisma/client";
import { prisma } from "./db";

// Create a new people
export async function createPeople(
  name: string,
  document: string,
  password: string
): Promise<public_People> {
  return prisma.public_People.create({
    data: {
      name,
      document,
      password,
    },
  });
}

// Get a single people by the people id
export async function getPeople(
  peopleId: number
): Promise<public_People | null> {
  return prisma.public_People.findUnique({
    where: {
      id: peopleId,
    },
  });
}
