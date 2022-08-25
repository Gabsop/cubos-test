import { public_People } from "@prisma/client";
import { getPeople } from "../../../../db/people";

const Get = async (
  req: { query: { peopleId: string } },
  res: {
    json: (arg0: {
      id: number | undefined;
      name: string | undefined;
      document: string | undefined;
      createdAt: Date | undefined;
      updatedAt: Date | undefined;
    }) => void;
  }
) => {
  const { peopleId } = req.query;
  const people: public_People | null = await getPeople(Number(peopleId));
  res.json({
    id: people?.id,
    name: people?.name,
    document: people?.document,
    createdAt: people?.created_at,
    updatedAt: people?.updated_at,
  });
};

export default Get;
