import { vazirmatn } from "@/app/fonts";
import { getPost } from "@/bin/hashnode";
import {
  Container,
  Title,
  TypographyStylesProvider,
  Image,
} from "@mantine/core";
import React from "react";

async function Page({ params: { slug } }: { params: { slug: string } }) {
  console.log(slug);
  const post = await getPost(slug);
  return (
    <Container
      style={{
        padding: "0 1rem",
        paddingBlockEnd: "4rem",
      }}
      bg={"gray.2"}
    >
      {post.publication.post.coverImage && (
        <Image
          src={post.publication.post.coverImage.url}
          alt="cover"
          w={"100%"}
          mah={"400px"}
          style={{ borderRadius: 4, objectFit: "cover" }}
        />
      )}
      <Title order={2} mb={"lg"}>
        {post.publication.post.title}
      </Title>
      <TypographyStylesProvider className={vazirmatn.className}>
        <div
          dangerouslySetInnerHTML={{
            __html: post.publication.post.content.html,
          }}
        />
      </TypographyStylesProvider>
    </Container>
  );
}

export default Page;
