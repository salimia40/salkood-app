import React from "react";

import { prisma } from "db";
import NotesList from "./NotesList";

export default async function Notes({ userId }: { userId: string }) {
  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <NotesList notes={notes} />;
}
