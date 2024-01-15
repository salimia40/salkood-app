"use client";

import { List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useState } from "react";
import { Button, Text, Title } from "@mantine/core";
import Image from "next/image";
import { vazirmatn } from "../fonts";
import Link from "next/link";
import { getPosts } from "@/bin/actions/publication";

function Publication({
  publication,
}: {
  publication: {
    publication: {
      posts: {
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
        edges: {
          node: {
            id: string;
            title: string;
            subtitle: string;
            slug: string;
            brief: string;
            coverImage: {
              url: string;
            };
            tags: {
              name: string;
            }[];
          };
        }[];
      };
    };
  };
}) {
  const posts = publication.publication.posts.edges.map((post) => post.node);
  const [postsList, setPostsList] = useState(posts);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(
    publication.publication.posts.pageInfo.endCursor,
  );
  const [hasMore, setHasMore] = useState(
    publication.publication.posts.pageInfo.hasNextPage,
  );

  return (
    <InfiniteScroll
      dataLength={postsList.length}
      hasMore={hasMore}
      loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
      next={async () => {
        if (loading) return;
        setLoading(true);
        const newPosts = await getPosts(cursor);
        setPostsList([
          ...postsList,
          ...newPosts.publication.posts.edges.map((post) => post.node),
        ]);
        setHasMore(newPosts.publication.posts.pageInfo.hasNextPage);
        setCursor(newPosts.publication.posts.pageInfo.endCursor);
        setLoading(false);
      }}
    >
      <List
        dataSource={posts}
        itemLayout="vertical"
        renderItem={(post) => (
          <List.Item
            key={post.id}
            extra={
              post.coverImage && (
                <Image
                  width={272}
                  height={200}
                  alt="logo"
                  src={post.coverImage.url}
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                />
              )
            }
            actions={[
              <Button
                variant="transparent"
                component={Link}
                key={post.id}
                href={`/blog/${post.slug}`}
                className={vazirmatn.className}
              >
                مشاهده
              </Button>,
            ]}
          >
            {/* <div style={{ paddingInlineEnd: "10px" }}> */}
            <Title order={4}>{post.title}</Title>
            <Text>{post.subtitle}</Text>
            <Text className={vazirmatn.className}>{post.brief}</Text>
            {/* </div> */}
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
}

export default Publication;
