import { public_People } from "@prisma/client";
import { createPeople } from "../../db/people";

export default async function Post(
  req: { body: { name: string; document: string; password: string } },
  res: {
    json: (arg0: {
      id: number;
      name: string;
      document: string;
      createdAt: Date;
      updatedAt: Date;
    }) => void;
  }
) {
  const { name, document, password } = req.body;
  const people: public_People = await createPeople(name, document, password);
  res.json({
    id: people.id,
    name: people.name,
    document: people.document,
    createdAt: people.created_at,
    updatedAt: people.updated_at,
  });
}
