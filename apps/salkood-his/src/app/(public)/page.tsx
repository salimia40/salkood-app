import { getPosts } from "@/bin/hashnode";
import { Container } from "@mantine/core";
import Link from "next/link";
import Publication from "./Publication";

export default async function Home() {
  const publication = await getPosts();

  return (
    <Container>
      <h1>Home</h1>
      <Link href="/dashboard">
        <p>Admin Area</p>
      </Link>
      <Publication publication={publication} />
    </Container>
  );
}
