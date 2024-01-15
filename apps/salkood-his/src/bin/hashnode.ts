import { gql, request } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { parse } from "graphql";

const host = "https://gql.hashnode.com";

const getPosts = async (after?: string) => {
  const query: TypedDocumentNode<
    {
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
    },
    {
      after?: string;
    }
  > = parse(gql`
  {
    publication(host: "salkood.hashnode.dev") {
      posts(first: 5, after: ${after ? `"${after}"` : "null"}) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            title
            subtitle
            slug
            brief
            coverImage {
              url
            }
            tags {
              name
            }
          }
        }
      }
    }
  }
`);
  return request(host, query, { after });
};

const getPost = async (slug: string) => {
  const query: TypedDocumentNode<
    {
      publication: {
        post: {
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
          content: {
            html: string;
          };
        };
      };
    },
    {
      slug: string;
    }
  > = parse(gql`
    {
      publication(host: "salkood.hashnode.dev") {
        post(slug: "${slug}") {
          id
            title
            subtitle
            slug
            brief
            coverImage {
              url
            }
            tags {
              name
            }
            content {
                html
            }
        }
      }
    }
  
`);
  return request(host, query, { slug });
};

export { getPosts, getPost };
